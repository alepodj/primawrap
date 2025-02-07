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
  '/forgot-password',
  '/reset-password',
  '/about-us',
  '/contact-us',
  '/privacy-policy',
  '/conditions-of-use',
  '/help',
  '/terms-of-service',
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

  // Check for admin routes and role
  const isAdminRoute =
    pathname.startsWith(`/${routing.defaultLocale}/admin`) ||
    pathname.startsWith('/admin')

  // Check role from session
  if (
    isAdminRoute &&
    (!req.auth?.user?.role || req.auth.user.role !== 'Admin')
  ) {
    console.log('Access denied - User role:', req.auth?.user?.role)
    // Redirect non-admin users to home page
    const url = new URL(req.url)
    const newUrl = new URL(`/${routing.defaultLocale}`, url.origin)
    return NextResponse.redirect(newUrl)
  }

  return response
})

// Update matcher to handle all routes except api, _next, and static files
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
