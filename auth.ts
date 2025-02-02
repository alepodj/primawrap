import { MongoDBAdapter } from '@auth/mongodb-adapter'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectToDatabase } from './lib/db'
import client from './lib/db/client'
import User from './lib/db/models/user.model'

import NextAuth, { type DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import authConfig from './auth.config'

declare module 'next-auth' {
  interface Session {
    user: {
      role: string
      phone?: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    phone?: string
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  pages: {
    signIn: '/sign-in',
    newUser: '/sign-up',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: MongoDBAdapter(client),
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
      async profile(profile) {
        // Try to find existing user to preserve their phone number
        await connectToDatabase()
        const existingUser = await User.findOne({ email: profile.email })

        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: existingUser?.role || 'User',
          phone: existingUser?.phone, // Preserve existing phone number if user exists
        }
      },
    }),
    CredentialsProvider({
      credentials: {
        email: {
          type: 'email',
        },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        await connectToDatabase()
        if (credentials == null) return null

        const user = await User.findOne({ email: credentials.email })

        if (user && user.password) {
          const isMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          )
          if (isMatch) {
            return {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              phone: user.phone,
            }
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    // Updated for a more efficient way to handle user data
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        // Only set these values when the user first signs in
        token.name = user.name
        token.role = (user as { role: string }).role
        token.phone = (user as { phone?: string }).phone
      }

      // Handle role updates if needed
      if (trigger === 'update' && session?.user) {
        if (session.user.name) token.name = session.user.name
        if (session.user.role) token.role = session.user.role
        if (session.user.phone !== undefined) token.phone = session.user.phone
      }

      return token
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.sub as string
        session.user.role = token.role as string
        session.user.name = token.name as string
        session.user.phone = token.phone as string | undefined
      }
      return session
    },
  },
})
