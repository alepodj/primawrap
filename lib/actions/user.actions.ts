'use server'

import bcrypt from 'bcryptjs'
import { auth, signIn, signOut } from '@/auth'
import {
  IUserName,
  IUserSignIn,
  IUserSignUp,
  IUserPhone,
  IAddressForm,
  IAddressUpdate,
} from '@/types'
import { UserSignUpSchema, UserUpdateSchema } from '../validator'
import { connectToDatabase } from '../db'
import User, { IUser } from '../db/models/user.model'
import { formatError } from '../utils'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getSetting } from './setting.actions'
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendAccountDeletionEmail,
} from '@/emails'
import crypto from 'crypto'
import { i18n } from '@/i18n-config'
import client from '../db/client'
import { ObjectId } from 'mongodb'

// CREATE
export async function registerUser(
  userSignUp: IUserSignUp,
  callbackUrl?: string
) {
  try {
    const user = await UserSignUpSchema.parseAsync({
      name: userSignUp.name,
      email: userSignUp.email,
      password: userSignUp.password,
      confirmPassword: userSignUp.confirmPassword,
    })

    await connectToDatabase()

    // Check if user already exists
    const existingUser = await User.findOne({ email: user.email })
    if (existingUser) {
      return { success: false, error: 'Email already registered' }
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Create user with verification token and optional fields
    await User.create({
      ...user,
      password: await bcrypt.hash(user.password, 5),
      verificationToken,
      verificationTokenExpiry,
      emailVerified: false,
      phone: userSignUp.phone,
      role: userSignUp.role || 'User',
      addresses: userSignUp.addresses?.map((addr) => ({
        ...addr,
        _id: new ObjectId().toString(),
      })),
    })

    // Send verification email with callbackUrl
    await sendVerificationEmail({
      email: user.email,
      name: user.name,
      token: verificationToken,
      callbackUrl,
    })

    return {
      success: true,
      message: 'Please check your email to verify your account',
    }
  } catch (error) {
    return { success: false, error: formatError(error) }
  }
}

// VERIFY EMAIL
export async function verifyEmail(token: string) {
  try {
    await connectToDatabase()

    // First try to find the user without expiry check to see if token exists
    const anyUser = await User.findOne({ verificationToken: token })
    if (!anyUser) {
      return { success: false, error: 'Invalid verification link' }
    }

    // Now check with expiry
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    })

    if (!user) {
      return { success: false, error: 'Verification link has expired' }
    }

    // First attempt - try with findOneAndUpdate
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: user._id,
        verificationToken: token,
      },
      {
        $set: { emailVerified: true },
        $unset: { verificationToken: '', verificationTokenExpiry: '' },
      },
      {
        new: true,
        runValidators: true,
      }
    )

    if (!updatedUser || !updatedUser.emailVerified) {
      // Second attempt - try direct save
      user.emailVerified = true
      user.verificationToken = undefined
      user.verificationTokenExpiry = undefined

      try {
        const savedUser = await user.save()

        if (!savedUser.emailVerified) {
          return {
            success: false,
            error: 'Failed to verify email. Please try again.',
          }
        }
      } catch (saveError) {
        throw saveError
      }
    }

    // Final verification check
    const finalCheck = await User.findById(user._id)

    if (!finalCheck?.emailVerified) {
      return {
        success: false,
        error: 'Failed to verify email. Please try again.',
      }
    }

    return {
      success: true,
      message: 'Email verified successfully',
    }
  } catch (error) {
    return { success: false, error: formatError(error) }
  }
}

// DELETE

export async function deleteUser(id: string) {
  try {
    await connectToDatabase()
    const res = await User.findByIdAndDelete(id)
    if (!res) throw new Error('Use not found')
    revalidatePath('/admin/users')
    return {
      success: true,
      message: 'User deleted successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export async function deleteAccount(password: string) {
  try {
    await connectToDatabase()
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('User not found')
    }

    // Get user from database
    const user = await User.findById(session.user.id)
    if (!user) {
      throw new Error('User not found')
    }

    // For users who signed up with credentials, verify password
    if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return { success: false, message: 'Invalid password' }
      }
    }

    // Delete from accounts collection first (for OAuth users)
    const db = client.db()

    // Convert string ID to ObjectId for accounts collection query
    const userObjectId = new ObjectId(session.user.id)
    await db.collection('accounts').deleteOne({
      userId: userObjectId,
    })

    // Delete user from MongoDB users collection last
    await User.findByIdAndDelete(session.user.id)

    // Send confirmation email
    await sendAccountDeletionEmail({
      email: user.email,
      name: user.name,
    })

    // Sign out the user
    await signOut({ redirect: false })

    return {
      success: true,
      message: 'Account deleted successfully',
    }
  } catch (error) {
    console.error('Error deleting account:', error)
    return { success: false, message: formatError(error) }
  }
}

// UPDATE

export async function updateUser(user: z.infer<typeof UserUpdateSchema>) {
  try {
    await connectToDatabase()
    const dbUser = await User.findById(user._id)
    if (!dbUser) throw new Error('User not found')

    // Update basic fields
    dbUser.name = user.name
    dbUser.email = user.email
    dbUser.role = user.role
    dbUser.phone = user.phone

    // Update addresses - ensure each address has an _id
    dbUser.addresses = user.addresses.map((addr) => ({
      ...addr,
      _id: addr._id || new ObjectId().toString(),
    }))

    // Ensure only one address is default
    if (dbUser.addresses?.length > 0) {
      const defaultAddresses = dbUser.addresses.filter((addr) => addr.isDefault)
      if (defaultAddresses.length === 0) {
        dbUser.addresses[0].isDefault = true
      } else if (defaultAddresses.length > 1) {
        // If multiple defaults found, keep only the first one as default
        defaultAddresses.slice(1).forEach((addr) => {
          const address = dbUser.addresses.find((a) => a._id === addr._id)
          if (address) address.isDefault = false
        })
      }
    }

    const updatedUser = await dbUser.save()
    revalidatePath('/admin/users')
    return {
      success: true,
      message: 'User updated successfully',
      data: JSON.parse(JSON.stringify(updatedUser)),
    }
  } catch (error) {
    console.error('Error updating user:', error)
    return { success: false, message: formatError(error) }
  }
}

export async function updateUserName(user: IUserName) {
  try {
    await connectToDatabase()
    const session = await auth()
    const currentUser = await User.findById(session?.user?.id)
    if (!currentUser) throw new Error('User not found')
    currentUser.name = user.name
    const updatedUser = await currentUser.save()
    return {
      success: true,
      message: 'User updated successfully',
      data: JSON.parse(JSON.stringify(updatedUser)),
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export async function updateUserPhone(user: IUserPhone) {
  try {
    await connectToDatabase()
    const session = await auth()

    if (!session?.user?.id) {
      console.error('No user ID in session')
      throw new Error('User not found')
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: session.user.id },
      { $set: { phone: user.phone } },
      { new: true, runValidators: true }
    )

    if (!updatedUser) {
      console.error('User not found in database')
      throw new Error('User not found')
    }

    // Revalidate the account page to show updated data
    revalidatePath('/account/manage')

    return {
      success: true,
      message: 'Phone number updated successfully',
      data: JSON.parse(JSON.stringify(updatedUser)),
    }
  } catch (error) {
    console.error('Error updating phone:', error)
    return { success: false, message: formatError(error) }
  }
}

export async function signInWithCredentials(user: IUserSignIn) {
  return await signIn('credentials', { ...user, redirect: false })
}

export const SignInWithGoogle = async () => {
  await signIn('google')
}

export const SignOut = async () => {
  try {
    await signOut({ redirect: false })
    return { redirect: '/' }
  } catch (error) {
    console.error('Server-side sign out error:', error)
    throw error
  }
}

// GET
export async function getAllUsers({
  limit,
  page,
}: {
  limit?: number
  page: number
}) {
  const {
    common: { pageSize },
  } = await getSetting()
  limit = limit || pageSize
  await connectToDatabase()

  const skipAmount = (Number(page) - 1) * limit
  const users = await User.find()
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(limit)
  const usersCount = await User.countDocuments()
  return {
    data: JSON.parse(JSON.stringify(users)) as IUser[],
    totalPages: Math.ceil(usersCount / limit),
  }
}

export async function getUserById(userId: string) {
  await connectToDatabase()
  const user = await User.findById(userId)
  if (!user) throw new Error('User not found')
  return JSON.parse(JSON.stringify(user)) as IUser
}

// RESEND VERIFICATION EMAIL
export async function resendVerificationEmail(
  email: string,
  callbackUrl?: string
) {
  try {
    await connectToDatabase()
    const user = await User.findOne({ email })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    if (user.emailVerified) {
      return { success: false, error: 'Email is already verified' }
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Update user with new token
    user.verificationToken = verificationToken
    user.verificationTokenExpiry = verificationTokenExpiry
    await user.save()

    // Send verification email
    await sendVerificationEmail({
      email: user.email,
      name: user.name,
      token: verificationToken,
      callbackUrl,
    })

    return {
      success: true,
      message: 'Verification email sent successfully',
    }
  } catch (error) {
    return { success: false, error: formatError(error) }
  }
}

// CHECK EMAIL VERIFICATION
export async function checkEmailVerification(email: string) {
  try {
    await connectToDatabase()

    const user = await User.findOne({ email })

    if (!user) {
      return { success: false, error: 'Invalid email or password' }
    }

    if (!user.emailVerified) {
      return {
        success: false,
        error: 'Please verify your email before signing in',
        needsVerification: true,
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error checking email verification:', error)
    return { success: false, error: formatError(error) }
  }
}

// PASSWORD RESET
export async function requestPasswordReset(email: string, locale?: string) {
  try {
    await connectToDatabase()
    const user = await User.findOne({ email })

    if (!user) {
      return { success: false, error: 'No account found with this email' }
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Update user with reset token using findOneAndUpdate
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          resetToken: resetToken,
          resetTokenExpiry: resetTokenExpiry,
        },
      },
      { new: true, runValidators: true }
    )

    if (!updatedUser) {
      console.error('Failed to update user with reset token')
      return { success: false, error: 'Failed to process password reset' }
    }

    // Send reset email with properly encoded token
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || ''
    const resetUrl = `${baseUrl}/${locale || i18n.defaultLocale}/reset-password?token=${encodeURIComponent(resetToken)}`

    await sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      resetUrl,
    })

    return {
      success: true,
      message: 'Password reset instructions sent to your email',
    }
  } catch (error) {
    console.error('Request password reset error:', error)
    return { success: false, error: formatError(error) }
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    await connectToDatabase()

    // First check if token exists at all
    const userWithToken = await User.findOne({ resetToken: token })
    if (!userWithToken) {
      return {
        success: false,
        error: 'Password reset link is invalid',
      }
    }

    // Then check if token is expired
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    })

    if (!user) {
      return {
        success: false,
        error: 'Password reset link has expired',
      }
    }

    // Update password and clear reset token using findOneAndUpdate
    const updatedUser = await User.findOneAndUpdate(
      { resetToken: token },
      {
        $set: { password: await bcrypt.hash(newPassword, 5) },
        $unset: { resetToken: 1, resetTokenExpiry: 1 },
      },
      { new: true }
    )

    if (!updatedUser) {
      console.error('Failed to update password')
      return {
        success: false,
        error: 'Failed to reset password',
      }
    }

    return {
      success: true,
      message: 'Password has been reset successfully',
    }
  } catch (error) {
    console.error('Reset password error:', error)
    return { success: false, error: formatError(error) }
  }
}

// Address Management
export async function addAddress(address: IAddressForm) {
  try {
    await connectToDatabase()
    const session = await auth()
    if (!session?.user?.id) throw new Error('User not found')

    const user = await User.findById(session.user.id)
    if (!user) throw new Error('User not found')

    // Initialize addresses array if it doesn't exist
    if (!user.addresses) {
      user.addresses = []
    }

    // If this is the first address or isDefault is true, make it default
    if (user.addresses.length === 0 || address.isDefault) {
      // Set all other addresses to non-default
      user.addresses.forEach((addr) => {
        addr.isDefault = false
      })
    }

    // Create a new address with an ObjectId
    const newAddress = {
      _id: new ObjectId().toString(),
      ...address,
    }

    user.addresses.push(newAddress)
    await user.save()

    revalidatePath('/account/addresses')
    return {
      success: true,
      message: 'Address added successfully',
      data: JSON.parse(JSON.stringify(user)),
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export async function updateAddress(address: IAddressUpdate) {
  try {
    await connectToDatabase()
    const session = await auth()
    if (!session?.user?.id) throw new Error('User not found')

    const user = await User.findById(session.user.id)
    if (!user) throw new Error('User not found')

    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === address._id
    )
    if (addressIndex === -1) throw new Error('Address not found')

    // If setting as default, update other addresses
    if (address.isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false
      })
    }

    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex],
      ...address,
    }

    await user.save()

    revalidatePath('/account/addresses')
    return {
      success: true,
      message: 'Address updated successfully',
      data: JSON.parse(JSON.stringify(user)),
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export async function deleteAddress(addressId: string) {
  try {
    await connectToDatabase()
    const session = await auth()
    if (!session?.user?.id) throw new Error('User not found')

    const user = await User.findById(session.user.id)
    if (!user) throw new Error('User not found')

    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === addressId
    )
    if (addressIndex === -1) throw new Error('Address not found')

    // If deleting default address, make the first remaining address default
    const wasDefault = user.addresses[addressIndex].isDefault
    user.addresses.splice(addressIndex, 1)

    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true
    }

    await user.save()

    revalidatePath('/account/addresses')
    return {
      success: true,
      message: 'Address deleted successfully',
      data: JSON.parse(JSON.stringify(user)),
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export async function setDefaultAddress(addressId: string) {
  try {
    await connectToDatabase()
    const session = await auth()
    if (!session?.user?.id) throw new Error('User not found')

    const user = await User.findById(session.user.id)
    if (!user) throw new Error('User not found')

    // Set all addresses to non-default first
    user.addresses.forEach((addr) => {
      addr.isDefault = addr._id.toString() === addressId
    })

    await user.save()

    revalidatePath('/account/addresses')
    return {
      success: true,
      message: 'Default address updated successfully',
      data: JSON.parse(JSON.stringify(user)),
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
