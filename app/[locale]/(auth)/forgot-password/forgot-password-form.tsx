'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import { requestPasswordReset } from '@/lib/actions/user.actions'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { CountdownRedirect } from '@/components/ui/countdown-redirect'
import { ForgotPasswordSchema } from '@/lib/validator'
import type { ForgotPasswordForm } from '@/types'
import { useTranslations } from 'next-intl'

export default function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const params = useParams()
  const searchParams = useSearchParams()
  const locale = typeof params.locale === 'string' ? params.locale : 'en-CA'
  const emailFromQuery = searchParams.get('email') || ''

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: emailFromQuery,
    },
  })

  const t = useTranslations('Locale')

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setIsSubmitting(true)
      const response = await requestPasswordReset(data.email, locale)

      if (response.success) {
        setEmailSent(true)
        toast({
          title: t('Email Sent'),
          description: response.message,
        })

      } else {
        toast({
          title: t('Error'),
          description: response.error,
          variant: 'destructive',
        })
      }

    } catch {
      toast({
        title: t('Error'),
        description: t('Something went wrong, please try again'),
        variant: 'destructive',
      })

    } finally {
      setIsSubmitting(false)
    }
  }

  if (emailSent) {
    return (
      <div className='space-y-4 text-center'>
        <h2 className='text-lg font-semibold'>Check Your Email</h2>
        <p className='text-muted-foreground'>
          {t("We've sent password reset instructions to your email address")}
          {t('Please check your inbox and spam folder')}
        </p>
        <div className='space-y-2'>

          <Button
            variant='outline'
            className='w-full'
            onClick={() => setEmailSent(false)}
          >
            {t('Try a different email')}
          </Button>
          <Link href={`/${locale}/sign-in`}>
            <Button variant='link' className='w-full'>
              {t('Back to Sign In')}
            </Button>
          </Link>
          <CountdownRedirect locale={locale} />
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Email')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('Enter your email address')}
                  type='email'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-full' disabled={isSubmitting}>
          {isSubmitting ? t('Sending') : t('Reset Password')}
        </Button>
        <div className='text-center'>
          <Link href={`/${locale}/sign-in`}>
            <Button variant='link'>{t('Back to Sign In')}</Button>
          </Link>
        </div>
      </form>
    </Form>
  )
}
