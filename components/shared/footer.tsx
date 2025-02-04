'use client'
import { ChevronUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import useSettingStore from '@/hooks/use-setting-store'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select'

import { SelectValue } from '@radix-ui/react-select'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { i18n } from '@/i18n-config'

export default function Footer() {
  const router = useRouter()
  const pathname = usePathname()
  const {
    setting: { site, availableCurrencies, currency },
    setCurrency,
  } = useSettingStore()
  const { locales } = i18n

  const locale = useLocale()
  const t = useTranslations('Locale')
  return (
    <footer className='bg-gradient-to-tl to-slate-700 from-slate-900 dark:to-slate-800 dark:from-slate-950 text-white'>
      <div className='w-full'>
        <Button
          variant='ghost'
          className='bg-gradient-to-br to-slate-800 from-slate-600 dark:to-slate-900 dark:from-slate-700 w-full rounded-none'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronUp className='mr-2 h-4 w-4 footer-link' />
          <span className='footer-link'>{t('Back to Top')}</span>
          <ChevronUp className='ml-2 h-4 w-4 footer-link' />
        </Button>

        <div>
          <div className='max-w-7xl mx-auto py-2 px-2 flex flex-col items-center space-y-2'>
            <div className='flex items-center space-x-2 flex-wrap md:flex-nowrap'>
              <Link
                href='/'
                className='transition-opacity hover:opacity-80 w-[150px] shrink-0'
              >
                <Image
                  src='/icons/prima-wrap.png'
                  alt={`${site.name} logo`}
                  width={150}
                  height={150}
                  priority
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                  }}
                />
              </Link>
              <Select
                value={locale}
                onValueChange={(value) => {
                  router.replace(pathname, { locale: value })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('Select a language')} />
                </SelectTrigger>
                <SelectContent>
                  {[
                    ...locales.filter((l) => l.code === locale),
                    ...locales.filter((l) => l.code !== locale),
                  ].map((lang, index) => (
                    <SelectItem key={index} value={lang.code}>
                      <div className='w-full flex items-center gap-1'>
                        <Image
                          src={lang.flagImg}
                          alt={lang.name}
                          width={20}
                          height={15}
                          className='inline-block'
                          style={{
                            maxWidth: '100%',
                            height: 'auto',
                          }}
                        />
                        {lang.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={currency}
                onValueChange={(value) => {
                  setCurrency(value)
                  window.scrollTo(0, 0)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('Select a currency')} />
                </SelectTrigger>
                <SelectContent>
                  {[
                    ...availableCurrencies.filter((x) => x.code === currency),
                    ...availableCurrencies.filter(
                      (x) => x.code && x.code !== currency
                    ),
                  ].map((currency, index) => (
                    <SelectItem
                      className='cursor-pointer'
                      key={index}
                      value={currency.code}
                    >
                      {currency.name} ({currency.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div className='p-2'>
        <div className='flex justify-center gap-4 text-sm'>
          <Link href='/page/conditions-of-use' className='footer-link'>
            {t('Conditions of Use')}
          </Link>
          <Link href='/page/privacy-policy' className='footer-link'>
            {t('Privacy Notice')}
          </Link>
          <Link href='/page/help' className='footer-link'>
            {t('Help')}
          </Link>
          <Link href='/page/blog' className='footer-link'>
            {t('Blog')}
          </Link>
          <Link href='/page/careers' className='footer-link'>
            {t('Careers')}
          </Link>
        </div>
        <div className='p-2'>
          <div className='flex justify-center gap-4 text-sm'>
            <Link href='/page/about-us' className='footer-link'>
              {t('About name', { name: site.name })}
            </Link>
            <Link href='/page/shipping' className='footer-link'>
              {t('Shipping Rates & Policies')}
            </Link>
            <Link href='/page/returns-policy' className='footer-link'>
              {t('Returns & Replacements')}
            </Link>
          </div>
        </div>
        <div className='mt-2 flex justify-center text-center text-sm'>
          <Link
            href='https://www.google.ca/search?q=%2B1+%28905%29+704-0087'
            target='_blank'
            className='footer-link'
          >
            {site.phone}
          </Link>
        </div>
        <div className='mt-2 flex justify-center text-center text-sm'>
          <Link
            href='https://g.co/kgs/J8oFq6L'
            target='_blank'
            className='footer-link'
          >
            {site.address}
          </Link>
        </div>
        <div className='flex mt-2 justify-center text-sm'>
          <p> © {t(site.copyright)}</p>
        </div>
      </div>
    </footer>
  )
}
