'use client'

import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function LoadingPage() {
  const t = useTranslations('Locale')

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm'>
      <div className='rounded-lg bg-card p-12 shadow-lg'>
        <div className='flex flex-col items-center gap-6'>
          <Image
            src='/icons/prima-wrap.png'
            alt='PrimaWrap Logo'
            width={250}
            height={250}
            priority
            style={{
              width: '250px',
              height: '250px',
            }}
          />
          <Loader2 className='h-16 w-16 animate-spin text-primary' />
          <p className='text-3xl font-medium text-muted-foreground'>
            {t('Loading')}
          </p>
        </div>
      </div>
    </div>
  )
}
