import type { NextAuthConfig } from 'next-auth'
import type { AdapterUser } from '@auth/core/adapters'
import type { User } from 'next-auth'

declare module '@auth/core/adapters' {
  interface AdapterUser {
    role: string
  }
}

declare module 'next-auth' {
  interface User {
    role: string
  }
}

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
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
  },
  providers: [], // configured in auth.ts
} satisfies NextAuthConfig
