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
import { resetPassword } from '@/lib/actions/user.actions'
import Link from 'next/link'
import { useSearchParams, useParams } from 'next/navigation'
import { Eye, EyeOff, Info } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { CountdownRedirect } from '@/components/ui/countdown-redirect'
import { ResetPasswordSchema } from '@/lib/validator'
import type { ResetPasswordForm } from '@/types'
import { useTranslations } from 'next-intl'

function PasswordStrengthIndicator({ password }: { password: string }) {
  const t = useTranslations('Locale')
  const requirements = [
    { regex: /.{8,}/, text: t('At least 8 characters') },
    { regex: /[A-Z]/, text: t('One uppercase letter') },
    { regex: /[a-z]/, text: t('One lowercase letter') },
    { regex: /[0-9]/, text: t('One number') },
    { regex: /[^A-Za-z0-9]/, text: t('One special character') },
  ]

  const strength = requirements.reduce(
    (count, requirement) => count + (requirement.regex.test(password) ? 1 : 0),
    0
  )

  return (
    <div className='space-y-2'>
      <Progress
        value={(strength / requirements.length) * 100}
        className='h-1'
      />
      <div className='text-xs text-muted-foreground'>
        <div className='flex items-center gap-1'>
          <Info className='h-3 w-3' />
          <span>{t('Password must contain')}:</span>
        </div>
        <ul className='ml-4 list-disc'>
          {requirements.map(({ text, regex }, index) => (
            <li
              key={index}
              className={regex.test(password) ? 'text-green-500' : undefined}
            >
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function ResetPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const searchParams = useSearchParams()
  const { locale } = useParams()
  const token = searchParams.get('token')
  const currentLocale = typeof locale === 'string' ? locale : 'en-CA'
  const t = useTranslations('Locale')
  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      toast({
        title: t('Error'),
        description: t('Invalid reset token'),
        variant: 'destructive',
      })

      return
    }

    try {
      setIsSubmitting(true)
      const response = await resetPassword(token, data.password)

      if (response.success) {
        setIsSuccess(true)
        toast({
          title: t('Success'),
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

  if (isSuccess) {
    return (
      <div className='space-y-4 text-center'>
        <h2 className='text-lg font-semibold'>
          {t('Password Reset Successful')}
        </h2>
        <p className='text-muted-foreground'>
          {t('Your password has been reset successfully')}
          {t('You can now sign in with your new password')}
        </p>
        <br />
        <Link href={`/${currentLocale}/sign-in`}>
          <Button className='w-full'>{t('Sign In')}</Button>
        </Link>
        <CountdownRedirect locale={currentLocale} />
      </div>
    )
  }

  if (!token) {
    return (
      <div className='space-y-4 text-center'>
        <h2 className='text-lg font-semibold'>{t('Invalid Reset Link')}</h2>
        <p className='text-muted-foreground'>
          {t('This password reset link is invalid or has expired')}
          {t('Please request a new password reset link')}
        </p>
        <Link href={`/${locale}/forgot-password`}>
          <Button className='w-full'>{t('Request New Reset Link')}</Button>
        </Link>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('New Password')}</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('Enter new password')}
                    {...field}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </Button>
                </div>
              </FormControl>
              <PasswordStrengthIndicator password={field.value} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Confirm New Password')}</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={t('Confirm new password')}
                    {...field}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full' disabled={isSubmitting}>
          {isSubmitting ? t('Resetting') : t('Reset Password')}
        </Button>
      </form>
    </Form>
  )
}
