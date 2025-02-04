import { getSetting } from '@/lib/actions/setting.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { site } = await getSetting()
  return (
    <div className='flex flex-col min-h-screen highlight-link'>
      <main className='flex-1 flex items-center justify-center'>
        <div className='w-full max-w-sm min-w-80 p-4'>
          <div className='flex justify-center mb-8'>
            <Link href='/'>
              <Image
                src='/icons/prima-wrap.png'
                alt='PrimaWrap Logo'
                width={250}
                height={250}
                priority
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </Link>
          </div>
          {children}
        </div>
      </main>
      <footer className='bg-gradient-to-tl to-slate-700 from-slate-900 dark:to-slate-800 dark:from-slate-950 w-full flex flex-col gap-2 items-center p-4 text-sm'>
        <div className='flex justify-center space-x-4'>
          <Link
            className='!footer-link !text-white'
            href='/page/conditions-of-use'
          >
            Conditions of Use
          </Link>
          <Link
            className='!footer-link !text-white'
            href='/page/privacy-policy'
          >
            {' '}
            Privacy Notice
          </Link>
          <Link className='!footer-link !text-white' href='/page/help'>
            {' '}
            Help{' '}
          </Link>
        </div>

        <div>
          <p className='flex justify-center text-sm text-white'>
            © {site.copyright}
          </p>
        </div>
      </footer>
    </div>
  )
}
