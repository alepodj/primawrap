import {
  EllipsisVertical,
  Home,
  User,
  Bell,
  ShoppingCart,
  // Settings
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import CartButton from './cart-button'
import UserButton from './user-button'
import ThemeSwitcher from './theme-switcher'
import LanguageSwitcher from './language-switcher'
import CurrencySwitcher from './currency-switcher'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  onClick?: () => void
  className?: string
}

const NavItem = ({ href, icon, label, onClick, className }: NavItemProps) => (
  <SheetClose asChild>
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-4 p-4 rounded-lg hover:bg-white/10 transition-colors',
        className
      )}
    >
      {icon}
      <span className='text-base font-medium'>{label}</span>
    </Link>
  </SheetClose>
)

const Menu = ({ forAdmin = false }: { forAdmin?: boolean }) => {
  const t = useTranslations('Locale')
  return (
    <div className='flex justify-end'>
      <nav className='md:flex gap-3 hidden w-full'>
        <div className='flex items-center gap-2'>
          <LanguageSwitcher />
          <CurrencySwitcher />
        </div>
        <ThemeSwitcher />
        <UserButton />
        {forAdmin ? null : <CartButton />}
      </nav>
      <nav className='md:hidden'>
        <Sheet>
          <SheetTrigger className='align-middle header-button p-3'>
            <EllipsisVertical className='h-6 w-6' />
          </SheetTrigger>
          <SheetContent
            side='right'
            className='bg-gradient-to-tl from-slate-700 to-slate-900 text-white flex flex-col'
          >
            <SheetHeader className='text-left border-b border-white/10 pb-6'>
              <SheetTitle className='text-white flex items-center gap-4'>
                <div className='w-16 h-16 rounded-full bg-white/20 flex items-center justify-center'>
                  <User className='w-8 h-8 text-white' />
                </div>
                <div>
                  <UserButton />
                </div>
              </SheetTitle>
            </SheetHeader>

            <div className='flex-1 py-6 flex flex-col gap-2'>
              <NavItem
                href='/'
                icon={<Home className='w-6 h-6 text-white' />}
                label={t('Home')}
              />
              <NavItem
                href='/account'
                icon={<User className='w-6 h-6 text-white' />}
                label={t('Account')}
              />
              <NavItem
                href='/account/orders'
                icon={<Bell className='w-6 h-6 text-white' />}
                label={t('Orders')}
              />
              {!forAdmin && (
                <NavItem
                  href='/cart'
                  icon={<ShoppingCart className='w-6 h-6 text-white' />}
                  label={t('Cart')}
                />
              )}
            </div>

            <div className='border-t border-white/10 pt-6 flex flex-col gap-2'>
              <div className='px-4 py-3'>
                <div className='text-base font-medium text-white/60 mb-4'>
                  {t('Preferences')}
                </div>
                <div className='flex flex-col gap-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-base'>{t('Language')}</span>
                    <LanguageSwitcher />
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-base'>{t('Currency')}</span>
                    <CurrencySwitcher />
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-base'>{t('Theme')}</span>
                    <ThemeSwitcher />
                  </div>
                </div>
              </div>
              {/* <NavItem
                href='/settings'
                icon={<Settings className='w-5 h-5 text-primary' />}
                label={t('Settings')}
              /> */}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}

export default Menu
