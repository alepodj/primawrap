import NextAuth from 'next-auth'
import authConfig from './auth.config'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextResponse } from 'next/server'

const publicPages = [
  '/',
  '/search',
  '/sign-in',
  '/sign-up',
  '/cart',
  '/cart/(.*)',
  '/product/(.*)',
  '/page/(.*)',
  '/verify-email',
  // (/secret requires auth)
]

const intlMiddleware = createMiddleware(routing)
const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl

  // First, handle the intl middleware for all requests
  const response = intlMiddleware(req)

  // If it's a public page, return the intl middleware response directly
  const publicPathnameRegex = RegExp(
    `^(/(${routing.locales.join('|')}))?(${publicPages
      .flatMap((p) => (p === '/' ? ['', '/'] : p))
      .join('|')})/?$`,
    'i'
  )
  const isPublicPage = publicPathnameRegex.test(pathname)

  if (isPublicPage) {
    return response
  }

  // For protected pages, check authentication
  if (!req.auth) {
    const url = new URL(req.url)
    const newUrl = new URL(
      `/${routing.defaultLocale}/sign-in?callbackUrl=${encodeURIComponent(pathname)}`,
      url.origin
    )
    return NextResponse.redirect(newUrl)
  }

  return response
})

// Update matcher to handle all routes except api, _next, and static files
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
