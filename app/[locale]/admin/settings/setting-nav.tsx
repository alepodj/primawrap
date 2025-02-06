'use client'
import { cn } from '@/lib/utils'
import {
  Globe,
  DollarSign,
  CreditCard,
  Truck,
  Info,
  Sliders,
  Menu,
  Image as ImageIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const items = [
  {
    href: '#setting-site-info',
    label: 'Site Info',
    icon: Info,
  },
  {
    href: '#setting-common',
    label: 'Common Settings',
    icon: Sliders,
  },
  {
    href: '#setting-header-menus',
    label: 'Header Menus',
    icon: Menu,
  },
  {
    href: '#setting-carousels',
    label: 'Carousels',
    icon: ImageIcon,
  },
  {
    href: '#setting-languages',
    label: 'Languages',
    icon: Globe,
  },
  {
    href: '#setting-currencies',
    label: 'Currencies',
    icon: DollarSign,
  },
  {
    href: '#setting-payment-methods',
    label: 'Payment Methods',
    icon: CreditCard,
  },
  {
    href: '#setting-delivery-dates',
    label: 'Delivery Dates',
    icon: Truck,
  },
]

export default function SettingNav() {
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    )

    const sections = document.querySelectorAll('[id^="setting-"]')
    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault()
    const id = href.replace('#', '')
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -80
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={cn(
        'sticky top-16 nav:top-[5.5rem] z-50',
        'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        'border-b nav:border-none shadow-sm',
        'nav:backdrop-blur-none nav:bg-transparent',
        'nav:flex nav:flex-col',
        'px-4 py-3 w-full',
        'nav:mx-0 nav:px-0 nav:py-0',
        'transition-all duration-200'
      )}
    >
      <div
        className={cn(
          'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 nav:grid-cols-1 gap-1',
          'nav:flex nav:flex-col'
        )}
      >
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.href.replace('#', '')
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md',
                'hover:bg-accent/50 hover:text-accent-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ring-offset-0',
                'transition-all duration-200',
                'justify-start',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground/60'
              )}
            >
              <Icon
                className={cn('w-4 h-4 shrink-0', isActive && 'text-primary')}
              />
              <span className='truncate'>{item.label}</span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
