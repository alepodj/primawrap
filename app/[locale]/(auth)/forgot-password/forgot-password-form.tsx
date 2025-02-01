'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { useParams } from 'next/navigation'

const ForgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>

export default function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const params = useParams()
  const locale = typeof params.locale === 'string' ? params.locale : undefined

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setIsSubmitting(true)
      const response = await requestPasswordReset(data.email, locale)

      if (response.success) {
        setEmailSent(true)
        toast({
          title: 'Email Sent',
          description: response.message,
        })
      } else {
        toast({
          title: 'Error',
          description: response.error,
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
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
          We&apos;ve sent password reset instructions to your email address.
          Please check your inbox and spam folder.
        </p>
        <div className='space-y-2'>
          <Button
            variant='outline'
            className='w-full'
            onClick={() => setEmailSent(false)}
          >
            Try a different email
          </Button>
          <Link href={`/${locale}/sign-in`}>
            <Button variant='link' className='w-full'>
              Back to Sign In
            </Button>
          </Link>
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter your email address'
                  type='email'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-full' disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Reset Password'}
        </Button>
        <div className='text-center'>
          <Link href={`/${locale}/sign-in`}>
            <Button variant='link'>Back to Sign In</Button>
          </Link>
        </div>
      </form>
    </Form>
  )
}
