'use client'
import React from 'react'
import useCartSidebar from '@/hooks/use-cart-sidebar'
import CartSidebar from './cart-sidebar'
import { Toaster } from '../ui/toaster'
import { ThemeProvider } from './theme-provider'
import { ClientSetting } from '@/types'
import AppInitializer from './app-initializer'
import { usePathname } from 'next/navigation'

export default function ClientProviders({
  children,
  setting,
}: {
  children: React.ReactNode
  setting: ClientSetting
}) {
  const visible = useCartSidebar()
  const pathname = usePathname()

  // Don't show cart sidebar in auth routes
  const isAuthRoute =
    pathname.includes('/sign-in') ||
    pathname.includes('/sign-up') ||
    pathname.includes('/forgot-password') ||
    pathname.includes('/reset-password') ||
    pathname.includes('/verify-email')

  return (
    <AppInitializer setting={setting}>
      <ThemeProvider
        attribute='class'
        defaultTheme={setting.common.defaultTheme.toLocaleLowerCase()}
      >
        {visible && !isAuthRoute ? (
          <div className='flex min-h-screen'>
            <div className='flex-1 overflow-hidden'>{children}</div>
            <CartSidebar />
          </div>
        ) : (
          <div>{children}</div>
        )}
        <Toaster />
      </ThemeProvider>
    </AppInitializer>
  )
}
