'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { cn } from '@/lib/utils'
import {
  Home,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  Settings,
  HardDrive,
} from 'lucide-react'
import { SheetClose } from '@/components/ui/sheet'

const links = [
  {
    title: 'Home',
    href: '/',
    icon: Home,
  },
  {
    title: 'Overview',
    href: '/admin/overview',
    icon: LayoutDashboard,
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: Package,
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Pages',
    href: '/admin/web-pages',
    icon: FileText,
  },
  {
    title: 'Storage',
    href: '/admin/storage',
    icon: HardDrive,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]

export function AdminNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const isMobileMenu = className?.includes('flex-col')

  return (
    <nav
      className={cn(
        'flex items-center space-x-4 nav:space-x-6',
        isMobileMenu && 'space-x-0 w-full flex-col items-stretch gap-1',
        className
      )}
      {...props}
    >
      {links.map((item) => {
        const Icon = item.icon
        const isActive =
          item.href === '/' ? pathname === '/' : pathname.includes(item.href)

        const LinkContent = (
          <>
            <Icon className='h-6 w-6 shrink-0' />
            <span>{item.title}</span>
          </>
        )

        return isMobileMenu ? (
          <SheetClose asChild key={item.href}>
            <Link
              href={item.href}
              className={cn(
                'flex items-center gap-3 text-base font-medium transition-colors w-full p-3 rounded-lg',
                'hover:bg-white/5',
                isActive ? 'text-white bg-white/5' : 'text-white/60'
              )}
            >
              {LinkContent}
            </Link>
          </SheetClose>
        ) : (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 text-base font-medium transition-colors hover:text-primary',
              isActive ? 'text-white' : 'text-white/60'
            )}
          >
            {LinkContent}
          </Link>
        )
      })}
    </nav>
  )
}
