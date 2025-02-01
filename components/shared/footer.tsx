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
  const t = useTranslations()
  return (
    <footer className='bg-gradient-to-tl to-slate-700 from-slate-900 text-white'>
      <div className='w-full'>
        <Button
          variant='ghost'
          className='bg-gradient-to-br to-slate-800 from-slate-600 w-full rounded-none'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronUp className='mr-2 h-4 w-4' />
          {t('Footer.Back to top')}
        </Button>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto'>
          <div>
            <h3 className='font-bold mb-2'>{t('Footer.Get to Know Us')}</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/page/careers' className='footer-link'>
                  {t('Footer.Careers')}
                </Link>
              </li>
              <li>
                <Link href='/page/blog' className='footer-link'>
                  {t('Footer.Blog')}
                </Link>
              </li>
              <li>
                <Link href='/page/about-us' className='footer-link'>
                  {t('Footer.About name', { name: site.name })}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='font-bold mb-2'>{t('Footer.Make Money with Us')}</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/page/sell' className='footer-link'>
                  {t('Footer.Sell products on', { name: site.name })}
                </Link>
              </li>
              <li>
                <Link href='/page/become-affiliate' className='footer-link'>
                  {t('Footer.Become an Affiliate')}
                </Link>
              </li>
              <li>
                <Link href='/page/advertise' className='footer-link'>
                  {t('Footer.Advertise Your Products')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='font-bold mb-2'>{t('Footer.Let Us Help You')}</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/page/shipping' className='footer-link'>
                  {t('Footer.Shipping Rates & Policies')}
                </Link>
              </li>
              <li>
                <Link href='/page/returns-policy' className='footer-link'>
                  {t('Footer.Returns & Replacements')}
                </Link>
              </li>
              <li>
                <Link href='/page/help' className='footer-link'>
                  {t('Footer.Help')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className='border-t border-gray-800'>
          <div className='max-w-7xl mx-auto py-8 px-4 flex flex-col items-center space-y-4'>
            <div className='flex items-center space-x-4 flex-wrap md:flex-nowrap'>
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
                  className='w-full h-auto'
                />
              </Link>
              <Select
                value={locale}
                onValueChange={(value) => {
                  router.push(pathname, { locale: value })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('Footer.Select a language')} />
                </SelectTrigger>
                <SelectContent>
                  {[
                    ...locales.filter((l) => l.code === locale),
                    ...locales.filter((l) => l.code !== locale),
                  ].map((lang, index) => (
                    <SelectItem key={index} value={lang.code}>
                      <Link
                        className='w-full flex items-center gap-1'
                        href={pathname}
                        locale={lang.code}
                      >
                        <Image
                          src={lang.flagImg}
                          alt={lang.name}
                          width={20}
                          height={15}
                          className='inline-block'
                        />
                        {lang.name}
                      </Link>
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
                  <SelectValue placeholder={t('Footer.Select a currency')} />
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
      <div className='p-4'>
        <div className='flex justify-center gap-4 text-sm'>
          <Link href='/page/conditions-of-use' className='footer-link'>
            {t('Footer.Conditions of Use')}
          </Link>
          <Link href='/page/privacy-policy' className='footer-link'>
            {t('Footer.Privacy Notice')}
          </Link>
          <Link href='/page/help' className='footer-link'>
            {t('Footer.Help')}
          </Link>
        </div>
        <div className='flex justify-center text-sm'>
          <p> © {site.copyright}</p>
        </div>
        <div className='mt-5 flex justify-center text-center text-sm text-gray-400'>
          {site.phone} <br /> {site.address}
        </div>
      </div>
    </footer>
  )
}
