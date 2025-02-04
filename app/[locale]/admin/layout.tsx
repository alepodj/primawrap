import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Menu from '@/components/shared/header/menu'
import { AdminNav } from './admin-nav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className='flex flex-col'>
        <div className='bg-gradient-to-tl from-slate-700 to-slate-900 dark:from-slate-800 dark:to-slate-950 text-white'>
          <div className='flex h-20 items-center px-2'>
            <Link href='/'>
              <Image
                src='/icons/prima-wrap.png'
                alt='PrimaWrap Logo'
                width={150}
                height={150}
                priority
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </Link>
            <AdminNav className='mx-6 hidden md:flex' />
            <div className='ml-auto flex items-center space-x-4'>
              <Menu forAdmin />
            </div>
          </div>
          <div>
            <AdminNav className='flex md:hidden px-4 pb-2' />
          </div>
        </div>
        <div className='flex-1 p-4'>{children}</div>
      </div>
    </>
  )
}
