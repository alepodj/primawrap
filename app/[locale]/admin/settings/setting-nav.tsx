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
    <nav className='space-y-1'>
      {items.map((item) => {
        const Icon = item.icon
        const isActive = activeSection === item.href.replace('#', '')
        return (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => scrollToSection(e, item.href)}
            className={cn(
              'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
              isActive && 'bg-accent text-accent-foreground'
            )}
          >
            <Icon className={cn('w-4 h-4', isActive && 'text-primary')} />
            {item.label}
          </a>
        )
      })}
    </nav>
  )
}
