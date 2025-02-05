import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

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
  '/maintenance',
  '/about-us',
  '/help',
]

// Pages that should be accessible during maintenance mode
const maintenanceBypassPages = ['/sign-in', '/api/auth/(.*)']

// Single pattern for admin pages
const ADMIN_ROUTE_PATTERN = '^/admin(?:/.*)?$'

const intlMiddleware = createMiddleware(routing)

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // First, handle the intl middleware for all requests
  const response = intlMiddleware(req)

  // Get token and check admin status
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  })
  const isAdmin = token?.role === 'Admin'
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true'
  const isMaintenancePage = pathname.endsWith('/maintenance')

  // Check if path is an admin route (accounting for locales)
  const isAdminPage = new RegExp(
    `^(/(${routing.locales.join('|')}))?(${ADMIN_ROUTE_PATTERN})/?$`,
    'i'
  ).test(pathname)

  const canBypassMaintenance = maintenanceBypassPages.some((page) =>
    new RegExp(`^(/(${routing.locales.join('|')}))?(${page})/?$`, 'i').test(
      pathname
    )
  )

  // Always allow admin pages for admin users
  if (isAdminPage) {
    if (!token || !isAdmin) {
      const url = new URL(req.url)
      const newUrl = new URL(
        `/${routing.defaultLocale}/sign-in?callbackUrl=${encodeURIComponent(pathname)}`,
        url.origin
      )
      return NextResponse.redirect(newUrl)
    }
    return response
  }

  // Check maintenance mode (skip for admin users and auth pages)
  if (
    isMaintenanceMode &&
    !isAdmin &&
    !isMaintenancePage &&
    !canBypassMaintenance
  ) {
    const url = new URL(req.url)
    return NextResponse.redirect(
      new URL(`/${routing.defaultLocale}/maintenance`, url.origin)
    )
  }

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
  if (!token) {
    const url = new URL(req.url)
    const newUrl = new URL(
      `/${routing.defaultLocale}/sign-in?callbackUrl=${encodeURIComponent(pathname)}`,
      url.origin
    )
    return NextResponse.redirect(newUrl)
  }

  return response
}

// Update matcher to handle all routes except api, _next, and static files
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
