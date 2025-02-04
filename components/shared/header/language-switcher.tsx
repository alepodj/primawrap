'use client'

import * as React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import useSettingStore from '@/hooks/use-setting-store'
import { i18n } from '@/i18n-config'
import { setCurrencyOnServer } from '@/lib/actions/setting.actions'
import { ChevronDownIcon } from 'lucide-react'
import Image from 'next/image'

export default function LanguageSwitcher() {
  const { locales } = i18n
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const currentLocale = locales.find((l) => l.code === locale)

  const {
    setting: { availableCurrencies, currency },
    setCurrency,
  } = useSettingStore()

  const handleCurrencyChange = async (newCurrency: string) => {
    await setCurrencyOnServer(newCurrency)
    setCurrency(newCurrency)
  }

  const currentCurrency = availableCurrencies.find((c) => c.code === currency)

  // Sort currencies to show current currency first, then others alphabetically
  const sortedCurrencies = React.useMemo(() => {
    return [
      // Show current currency first
      ...availableCurrencies.filter((c) => c.code === currency),
      // Then show other currencies alphabetically
      ...availableCurrencies
        .filter((c) => c.code && c.code !== currency)
        .sort((a, b) => a.code.localeCompare(b.code)),
    ]
  }, [availableCurrencies, currency])

  return (
    <div className='flex items-center gap-2'>
      <DropdownMenu>
        <DropdownMenuTrigger className='header-button h-[41px]'>
          <div className='flex items-center gap-2'>
            {currentCurrency?.symbol} {currency}
            <ChevronDownIcon />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Currency</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={currency}
            onValueChange={handleCurrencyChange}
          >
            {sortedCurrencies.map((c) => (
              <DropdownMenuRadioItem key={c.name} value={c.code}>
                {c.symbol} {c.code}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className='header-button h-[41px]'>
          <div className='flex items-center gap-2'>
            <Image
              src={currentLocale?.flagImg || ''}
              alt={currentLocale?.name || ''}
              width={20}
              height={15}
              className='inline-block'
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
            {locale.toUpperCase().slice(0, 2)}
            <ChevronDownIcon />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56'>
          <DropdownMenuLabel>Language</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={locale}
            onValueChange={(value) => {
              router.replace(pathname, { locale: value })
            }}
          >
            {[
              // Show current language first
              ...locales.filter((l) => l.code === locale),
              // Then show other languages
              ...locales.filter((l) => l.code !== locale),
            ].map((c) => (
              <DropdownMenuRadioItem key={c.name} value={c.code}>
                <div className='w-full flex items-center gap-2'>
                  <Image
                    src={c.flagImg}
                    alt={c.name}
                    width={20}
                    height={15}
                    className='inline-block'
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                    }}
                  />
                  {c.name}
                </div>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
