import { auth } from '@/auth'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { SignOut } from '@/lib/actions/user.actions'
import { cn } from '@/lib/utils'
import {
  ChevronDownIcon,
  User,
  ShoppingBag,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
  KeyRound,
} from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function UserButton() {
  const t = await getTranslations('Locale')
  const session = await auth()

  return (
    <div className='flex gap-2 items-center'>
      <DropdownMenu>
        <DropdownMenuTrigger className='header-button' asChild>
          <div className='flex items-center'>
            <div className='flex flex-col text-xs text-left'>
              <span>
                {t('Hello')}, {session ? session.user.name : t('sign in')}
              </span>
              <span className='font-bold'>{t('Account & Orders')}</span>
            </div>
            <ChevronDownIcon />
          </div>
        </DropdownMenuTrigger>
        {session ? (
          <DropdownMenuContent className='w-56' align='end' forceMount>
            <DropdownMenuLabel className='font-normal'>
              <div className='flex flex-col space-y-1'>
                <p className='text-sm font-medium leading-none'>
                  {session.user.name}
                </p>
                <p className='text-xs leading-none text-muted-foreground'>
                  {session.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <Link className='w-full' href='/account'>
                <DropdownMenuItem>
                  <User className='mr-2 h-4 w-4' />
                  {t('Your account')}
                </DropdownMenuItem>
              </Link>
              <Link className='w-full' href='/account/orders'>
                <DropdownMenuItem>
                  <ShoppingBag className='mr-2 h-4 w-4' />
                  {t('Your orders')}
                </DropdownMenuItem>
              </Link>

              {session.user.role?.toLowerCase() === 'admin' && (
                <Link className='w-full' href='/admin/overview'>
                  <DropdownMenuItem>
                    <LayoutDashboard className='mr-2 h-4 w-4' />
                    {t('Admin')}
                  </DropdownMenuItem>
                </Link>
              )}
            </DropdownMenuGroup>
            <DropdownMenuItem className='p-0 mb-1'>
              <form action={SignOut} className='w-full'>
                <Button
                  className='w-full py-4 px-2 h-4 justify-start'
                  variant='ghost'
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  {t('Sign out')}
                </Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        ) : (
          <DropdownMenuContent className='w-70' align='end' forceMount>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link
                  className={cn(
                    buttonVariants(),
                    'w-full flex items-center gap-2'
                  )}
                  href='/sign-in'
                >
                  <LogIn className='h-4 w-4' />
                  {t('Sign in')}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <Separator />
            <DropdownMenuLabel>
              <div className='font-normal space-y-2'>
                <div className='flex items-center gap-2'>
                  <UserPlus className='h-4 w-4' />
                  {t('New Customer')}?{' '}
                  <Link href='/sign-up' className='user-menu-link'>
                    {t('Sign up')}
                  </Link>
                </div>
                <div className='flex items-center gap-2'>
                  <KeyRound className='h-4 w-4' />
                  {t('Forgot Password')}?{' '}
                  <Link href='/forgot-password' className='user-menu-link'>
                    {t('Reset it')}
                  </Link>
                </div>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  )
}
