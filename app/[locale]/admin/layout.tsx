import React from 'react'
import { AdminNav } from './admin-nav'
import { Menu as MenuIcon } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import LanguageSwitcher from '@/components/shared/header/language-switcher'
import CurrencySwitcher from '@/components/shared/header/currency-switcher'
import ThemeSwitcher from '@/components/shared/header/theme-switcher'
import UserButton from '@/components/shared/header/user-button'
import { auth } from '@/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <>
      <div className='flex flex-col min-h-screen'>
        <div className='bg-gradient-to-tl from-slate-700 to-slate-900 dark:from-slate-800 dark:to-slate-950 text-white'>
          <div className='flex h-16 nav:h-20 items-center px-4 justify-between nav:justify-start'>
            <div className='flex items-center gap-6'>
              <Sheet>
                <SheetTrigger className='p-2 -ml-2 nav:hidden'>
                  <MenuIcon className='w-6 h-6' />
                </SheetTrigger>
                <SheetContent
                  side='left'
                  className='w-[300px] p-6 bg-gradient-to-tl from-slate-700 to-slate-900 text-white'
                >
                  <SheetTitle className='text-white mb-6'>
                    Admin Navigation
                  </SheetTitle>
                  <div className='flex flex-col gap-6'>
                    <AdminNav className='flex-col items-start gap-4' />

                    <div className='border-t border-white/10 pt-6'>
                      <div className='text-sm font-medium text-white/60 mb-4'>
                        Preferences
                      </div>
                      <div className='flex flex-col gap-4'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm'>Language</span>
                          <LanguageSwitcher />
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm'>Currency</span>
                          <CurrencySwitcher />
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm'>Theme</span>
                          <ThemeSwitcher />
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <AdminNav className='mx-6 hidden nav:flex' />

            <div className='flex items-center gap-2 nav:gap-4 ml-auto'>
              <div className='hidden nav:flex items-center gap-2'>
                <LanguageSwitcher />
                <CurrencySwitcher />
                <ThemeSwitcher />
              </div>
              <UserButton session={session} />
            </div>
          </div>
        </div>
        <div className='flex-1 p-4 nav:p-6 bg-gray-50/40 dark:bg-gray-900/40 min-h-screen'>
          {children}
        </div>
      </div>
    </>
  )
}
