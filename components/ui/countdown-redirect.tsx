'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { CountdownRedirectProps } from '@/types'

export function CountdownRedirect({
  locale,
  callbackUrl,
  seconds = 10,
}: CountdownRedirectProps) {
  const [countdown, setCountdown] = useState(seconds)
  const router = useRouter()

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
      Redirecting to home page in {countdown} seconds...
    </p>
  )
}
