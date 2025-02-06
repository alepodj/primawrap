'use client'
import { ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import useSettingStore from '@/hooks/use-setting-store'
import { useTranslations } from 'next-intl'

export default function Footer() {
  const {
    setting: { site },
  } = useSettingStore()
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
      </div>
      <div className='max-w-7xl mx-auto p-4 md:p-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
          <div className='space-y-6 md:space-y-4 text-center md:text-left'>
            <h3 className='text-xl md:text-lg font-semibold text-white/90'>
              {t('Company')}
            </h3>
            <div className='flex flex-col space-y-1'>
              <Link
                href='/about-us'
                className='footer-link hover:translate-x-1 transition-transform p-3 md:p-0 text-base rounded-lg hover:bg-white/5 md:hover:bg-transparent flex md:inline-flex justify-center md:justify-start items-center'
              >
                {t('About Us')}
              </Link>
              <Link
                href='/page/careers'
                className='footer-link hover:translate-x-1 transition-transform p-3 md:p-0 text-base rounded-lg hover:bg-white/5 md:hover:bg-transparent flex md:inline-flex justify-center md:justify-start items-center'
              >
                {t('Careers')}
              </Link>
              <Link
                href='/page/blog'
                className='footer-link hover:translate-x-1 transition-transform p-3 md:p-0 text-base rounded-lg hover:bg-white/5 md:hover:bg-transparent flex md:inline-flex justify-center md:justify-start items-center'
              >
                {t('Blog')}
              </Link>
            </div>
          </div>

          <div className='space-y-6 md:space-y-4 text-center md:text-left'>
            <h3 className='text-xl md:text-lg font-semibold text-white/90'>
              {t('Support')}
            </h3>
            <div className='flex flex-col space-y-1'>
              <Link
                href='/page/help'
                className='footer-link hover:translate-x-1 transition-transform p-3 md:p-0 text-base rounded-lg hover:bg-white/5 md:hover:bg-transparent flex md:inline-flex justify-center md:justify-start items-center'
              >
                {t('Help')}
              </Link>
              <Link
                href='/page/shipping'
                className='footer-link hover:translate-x-1 transition-transform p-3 md:p-0 text-base rounded-lg hover:bg-white/5 md:hover:bg-transparent flex md:inline-flex justify-center md:justify-start items-center'
              >
                {t('Shipping Rates & Policies')}
              </Link>
              <Link
                href='/page/returns-policy'
                className='footer-link hover:translate-x-1 transition-transform p-3 md:p-0 text-base rounded-lg hover:bg-white/5 md:hover:bg-transparent flex md:inline-flex justify-center md:justify-start items-center'
              >
                {t('Returns & Replacements')}
              </Link>
            </div>
          </div>

          <div className='space-y-6 md:space-y-4 text-center md:text-left'>
            <h3 className='text-xl md:text-lg font-semibold text-white/90'>
              {t('Legal')}
            </h3>
            <div className='flex flex-col space-y-1'>
              <Link
                href='/page/privacy-policy'
                className='footer-link hover:translate-x-1 transition-transform p-3 md:p-0 text-base rounded-lg hover:bg-white/5 md:hover:bg-transparent flex md:inline-flex justify-center md:justify-start items-center'
              >
                {t('Privacy Notice')}
              </Link>
              <Link
                href='/page/conditions-of-use'
                className='footer-link hover:translate-x-1 transition-transform p-3 md:p-0 text-base rounded-lg hover:bg-white/5 md:hover:bg-transparent flex md:inline-flex justify-center md:justify-start items-center'
              >
                {t('Conditions of Use')}
              </Link>
              <Link
                href='/page/terms-of-service'
                className='footer-link hover:translate-x-1 transition-transform p-3 md:p-0 text-base rounded-lg hover:bg-white/5 md:hover:bg-transparent flex md:inline-flex justify-center md:justify-start items-center'
              >
                {t('Terms of Service')}
              </Link>
            </div>
          </div>
        </div>

        <div className='border-t border-white/10 pt-8'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            <div className='flex flex-col md:flex-row items-center gap-4 text-center md:text-left'>
              <Link
                href='https://www.google.ca/search?q=%2B1+%28905%29+704-0087'
                target='_blank'
                className='footer-link hover:text-primary transition-colors text-base'
              >
                {site.phone}
              </Link>
              <span className='text-white/20 hidden md:inline'>|</span>
              <Link
                href='https://g.co/kgs/J8oFq6L'
                target='_blank'
                className='footer-link hover:text-primary transition-colors text-base'
              >
                {site.address}
              </Link>
            </div>
            <p className='text-base text-white/60'> © {t(site.copyright)}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
