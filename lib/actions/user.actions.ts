'use server'

import bcrypt from 'bcryptjs'
import { auth, signIn, signOut } from '@/auth'
import { IUserName, IUserSignIn, IUserSignUp } from '@/types'
import { UserSignUpSchema, UserUpdateSchema } from '../validator'
import { connectToDatabase } from '../db'
import User, { IUser } from '../db/models/user.model'
import { formatError } from '../utils'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getSetting } from './setting.actions'
import { sendVerificationEmail } from '@/emails'
import crypto from 'crypto'

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

    // Create user with verification token
    await User.create({
      ...user,
      password: await bcrypt.hash(user.password, 5),
      verificationToken,
      verificationTokenExpiry,
      emailVerified: false,
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

    console.log('Verifying email with token:', token)

    // First try to find the user without expiry check to see if token exists
    const anyUser = await User.findOne({ verificationToken: token })
    if (!anyUser) {
      console.log('No user found with this token at all')
      return { success: false, error: 'Invalid verification link' }
    }

    console.log('Token exists for user:', anyUser.email)
    console.log('Current verification status:', anyUser.emailVerified)
    console.log('Token expiry:', anyUser.verificationTokenExpiry)
    console.log('Current time:', new Date())

    // Now check with expiry
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    })

    if (!user) {
      console.log('Token expired or not found with expiry check')
      return { success: false, error: 'Verification link has expired' }
    }

    console.log('Found valid user:', user.email)
    console.log('User ID:', user._id)
    console.log('Current verification status:', user.emailVerified)
    console.log('Current verification token:', user.verificationToken)

    // First attempt - try with findOneAndUpdate
    console.log('Attempting update with findOneAndUpdate...')
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

    console.log('First update attempt result:', updatedUser)

    if (!updatedUser || !updatedUser.emailVerified) {
      console.log('First update attempt failed, trying alternative approach...')

      // Second attempt - try direct save
      user.emailVerified = true
      user.verificationToken = undefined
      user.verificationTokenExpiry = undefined

      try {
        const savedUser = await user.save()
        console.log('Second update attempt result:', savedUser)

        if (!savedUser.emailVerified) {
          console.error('Both update attempts failed')
          return {
            success: false,
            error: 'Failed to verify email. Please try again.',
          }
        }
      } catch (saveError) {
        console.error('Error during save:', saveError)
        throw saveError
      }
    }

    // Final verification check
    const finalCheck = await User.findById(user._id)
    console.log('Final verification check:', {
      email: finalCheck?.email,
      verified: finalCheck?.emailVerified,
      hasToken: !!finalCheck?.verificationToken,
    })

    if (!finalCheck?.emailVerified) {
      console.error('Final verification check failed')
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
    console.error('Error verifying email:', error)
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
// UPDATE

export async function updateUser(user: z.infer<typeof UserUpdateSchema>) {
  try {
    await connectToDatabase()
    const dbUser = await User.findById(user._id)
    if (!dbUser) throw new Error('User not found')
    dbUser.name = user.name
    dbUser.email = user.email
    dbUser.role = user.role
    const updatedUser = await dbUser.save()
    revalidatePath('/admin/users')
    return {
      success: true,
      message: 'User updated successfully',
      data: JSON.parse(JSON.stringify(updatedUser)),
    }
  } catch (error) {
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

export async function signInWithCredentials(user: IUserSignIn) {
  return await signIn('credentials', { ...user, redirect: false })
}
export const SignInWithGoogle = async () => {
  await signIn('google')
}
export const SignOut = async () => {
  const redirectTo = await signOut({ redirect: false })
  redirect(redirectTo.redirect)
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
    console.log('Checking email verification for:', email)

    const user = await User.findOne({ email })

    if (!user) {
      console.log('No user found with email:', email)
      return { success: false, error: 'Invalid email or password' }
    }

    console.log('Found user, verification status:', user.emailVerified)

    if (!user.emailVerified) {
      console.log('User email not verified')
      return {
        success: false,
        error: 'Please verify your email before signing in',
        needsVerification: true,
      }
    }

    console.log('User email is verified')
    return { success: true }
  } catch (error) {
    console.error('Error checking email verification:', error)
    return { success: false, error: formatError(error) }
  }
}
