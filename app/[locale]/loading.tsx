'use client'

import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function LoadingPage() {
  const t = useTranslations()

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm'>
      <div className='rounded-lg bg-card p-12 shadow-lg'>
        <div className='flex flex-col items-center gap-6'>
          <Image
            src='/icons/prima-wrap.png'
            alt='logo'
            width={150}
            height={150}
            priority
            style={{
              maxWidth: '100%',
              height: 'auto',
            }}
          />
          <Loader2 className='h-12 w-12 animate-spin text-primary' />
          <p className='text-2xl font-medium text-muted-foreground'>
            {t('Loading.Loading')}
          </p>
        </div>
      </div>
    </div>
  )
}
