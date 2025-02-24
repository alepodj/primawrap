'use client'

import { ChevronDownIcon, SunMedium, MoonStar } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import useColorStore from '@/hooks/use-color-store'
import useIsMounted from '@/hooks/use-is-mounted'
import { useTranslations } from 'next-intl'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const { availableColors, color, setColor } = useColorStore(theme)
  const t = useTranslations('Locale')
  const changeTheme = (value: string) => {
    setTheme(value)
  }
  const isMounted = useIsMounted()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='header-button h-[41px]'>
        {theme === 'dark' && isMounted ? (
          <div className='flex items-center gap-1'>
            <MoonStar className='h-5 w-5 text-white' /> {t('Dark')}{' '}
            <ChevronDownIcon />
          </div>
        ) : (
          <div className='flex items-center gap-1'>
            <SunMedium className='h-5 w-5 text-white' /> {t('Light')}{' '}
            <ChevronDownIcon />
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>Theme</DropdownMenuLabel>

        <DropdownMenuRadioGroup value={theme} onValueChange={changeTheme}>
          {[
            // Show current theme first
            theme === 'dark' ? 'dark' : 'light',
            // Then show other theme
            theme === 'dark' ? 'light' : 'dark',
          ].map((themeOption) => (
            <DropdownMenuRadioItem key={themeOption} value={themeOption}>
              {themeOption === 'dark' ? (
                <MoonStar className='h-5 w-5 mr-2' />
              ) : (
                <SunMedium className='h-5 w-5 mr-2' />
              )}{' '}
              {t(themeOption === 'dark' ? 'Dark' : 'Light')}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>{t('Color')}</DropdownMenuLabel>

        <DropdownMenuRadioGroup
          value={color.name}
          onValueChange={(value) => setColor(value, true)}
        >
          {[
            // Show current color first
            ...availableColors.filter((c) => c.name === color.name),
            // Then show other colors
            ...availableColors.filter((c) => c.name !== color.name),
          ].map((c) => (
            <DropdownMenuRadioItem key={c.name} value={c.name}>
              <div
                style={{ backgroundColor: c.name }}
                className='h-4 w-4 mr-1 rounded-full'
              ></div>
              {t(c.name)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
