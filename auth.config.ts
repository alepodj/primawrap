import type { NextAuthConfig } from 'next-auth'
import { connectToDatabase } from './lib/db'
import User from './lib/db/models/user.model'

// Notice this is only an object, not a full Auth.js instance
export default {
  pages: {
    signIn: '/sign-in',
    newUser: '/sign-up',
    error: '/sign-in',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const protectedPaths = ['/checkout', '/account', '/admin']
      const isProtected = protectedPaths.some((path) =>
        nextUrl.pathname.startsWith(path)
      )

      if (isProtected && !isLoggedIn) {
        const redirectUrl = new URL('/sign-in', nextUrl.origin)
        redirectUrl.searchParams.set('callbackUrl', nextUrl.href)
        return Response.redirect(redirectUrl)
      }

      return true
    },
  },
  providers: [], // configured in auth.ts
} satisfies NextAuthConfig
