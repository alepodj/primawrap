'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ChevronRight,
  UserCircle,
  MenuIcon,
  LogOut,
  Loader2,
  ShoppingBag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SignOut } from '@/lib/actions/user.actions'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { getDirection } from '@/i18n-config'
import { toast } from '@/hooks/use-toast'
import { useFormStatus } from 'react-dom'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Separator } from '@/components/ui/separator'

interface SidebarProps {
  categories: string[]
  locale: string
}

const SignOutButton = () => {
  const { pending } = useFormStatus()
  const t = useTranslations('Locale')
  return (
    <Button
      className='w-full justify-start text-base px-2 h-12'
      variant='ghost'
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className='mr-3 h-5 w-5 animate-spin' />
          {t('Signing out')}
        </>
      ) : (
        <>
          <LogOut className='mr-3 h-5 w-5' />
          {t('Sign out')}
        </>
      )}
    </Button>
  )
}

export default function Sidebar({ categories = [], locale }: SidebarProps) {
  const t = useTranslations('Locale')
  const { data: session } = useSession()
  const side = getDirection(locale) === 'rtl' ? 'right' : 'left'

  // Debug log to check categories
  React.useEffect(() => {
    console.log('Sidebar categories:', categories)
  }, [categories])

  async function handleSignOut() {
    try {
      const result = await SignOut()
      if (result.redirect) {
        toast({
          title: 'Signing out',
          description: 'You will be redirected in 3 seconds.',
        })
        setTimeout(() => {
          window.location.href = result.redirect
        }, 3000)
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant='ghost'
          className='header-button flex items-center gap-2 h-12 text-base'
        >
          <MenuIcon className='h-5 w-5' />
          {t('All')}
        </Button>
      </SheetTrigger>
      <SheetContent
        side={side}
        className='flex flex-col w-full sm:w-[300px] p-0 bg-gradient-to-tl from-slate-700 to-slate-900 text-white border-white/10'
      >
        <SheetHeader className='pt-6 px-6'>
          <SheetTitle className='text-white sr-only'>{t('Menu')}</SheetTitle>
        </SheetHeader>

        {/* User Greeting */}
        <div className='px-6 pb-6 flex items-center gap-4'>
          <UserCircle className='h-8 w-8' />
          <span className='text-lg font-medium'>
            {t('Hello')}, {session ? session.user.name : t('sign in')}
          </span>
        </div>

        <Separator className='bg-white/10' />

        {/* Categories Section */}
        <div className='px-6 py-4 flex-1 overflow-y-auto'>
          <h2 className='text-lg font-semibold mb-4'>
            {t('Shop By Category')}
          </h2>
          <div className='flex flex-col gap-2'>
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((category) => (
                <div key={category}>
                  <SheetClose asChild>
                    <Link
                      href={`/search?category=${encodeURIComponent(category)}`}
                      className='flex items-center justify-between py-3 px-2 hover:bg-white/10 rounded-md transition-colors'
                    >
                      <span className='text-base'>{category}</span>
                      <ChevronRight className='h-5 w-5' />
                    </Link>
                  </SheetClose>
                </div>
              ))
            ) : (
              <div className='text-sm text-white/60'>
                {t('No categories available')}
              </div>
            )}
          </div>
        </div>

        {/* Account Section */}
        <div className='mt-auto w-full'>
          <Separator className='bg-white/10' />
          <div className='p-4 flex flex-col gap-2'>
            {session ? (
              <>
                <SheetClose asChild>
                  <Link
                    href='/account'
                    className='w-full justify-start text-base px-2 h-12 hover:bg-white/10 rounded-md transition-colors flex items-center'
                  >
                    <UserCircle className='mr-3 h-5 w-5 flex-shrink-0' />
                    <span>{t('Your account')}</span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href='/account/orders'
                    className='w-full justify-start text-base px-2 h-12 hover:bg-white/10 rounded-md transition-colors flex items-center'
                  >
                    <ShoppingBag className='mr-3 h-5 w-5 flex-shrink-0' />
                    <span>{t('Your orders')}</span>
                  </Link>
                </SheetClose>
                <form action={handleSignOut} className='w-full'>
                  <SignOutButton />
                </form>
              </>
            ) : (
              <SheetClose asChild>
                <Link
                  href='/sign-in'
                  className='w-full justify-start text-base px-2 h-12 hover:bg-white/10 rounded-md transition-colors flex items-center'
                >
                  <LogOut className='mr-3 h-5 w-5 flex-shrink-0' />
                  <span>{t('Sign in')}</span>
                </Link>
              </SheetClose>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
