'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

function CountdownRedirect({
  locale,
  callbackUrl,
}: {
  locale: string
  callbackUrl?: string
}) {
  const [countdown, setCountdown] = useState(10)
  const router = useRouter()
  const t = useTranslations('Locale')
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      router.push(
        `/${locale}/sign-in${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`
      )
    }
  }, [countdown, locale, callbackUrl, router])

  return (
    <p className='text-sm text-muted-foreground mt-2'>
      {t('Redirecting to sign in page in')} {countdown} {t('seconds')}
    </p>
  )
}

export default function VerificationResult({
  success,
  error,
  locale,
  callbackUrl,
}: {
  success: boolean
  error?: string
  locale: string
  callbackUrl?: string
}) {
  const t = useTranslations('Locale')
  return (
    <div className='w-full'>
      <Card className='text-center'>
        <CardHeader>
          <div className='flex justify-center mb-4'>
            {success ? (
              <CheckCircle2 className='h-12 w-12 text-green-500' />
            ) : (
              <XCircle className='h-12 w-12 text-red-500' />
            )}
          </div>
          <CardTitle className='text-2xl'>
            {success
              ? t('Email Verification Successful!')
              : t('Verification Failed')}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-muted-foreground text-left'>
            {success ? (
              <>
                {t('Your email has been verified successfully')}
                {t('You can now sign in to your account')}
              </>
            ) : (
              error ||
              t(
                'The verification link is invalid or has expired, please request a new verification link'
              )
            )}
          </p>
          <div className='flex flex-col gap-2'>
            <Link
              href={`/${locale}/sign-in${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
              className='mx-auto'
            >
              <Button variant='default'>
                {success ? t('Sign In to Your Account') : t('Back to Sign In')}
              </Button>
            </Link>

            {!success && (
              <Link href={`/${locale}/sign-up`} className='mx-auto'>
                <Button variant='outline'>{t('Create New Account')}</Button>
              </Link>
            )}
          </div>
          {success && (
            <CountdownRedirect locale={locale} callbackUrl={callbackUrl} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
