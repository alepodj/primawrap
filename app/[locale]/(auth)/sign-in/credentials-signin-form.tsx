'use client'
import { redirect, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import useSettingStore from '@/hooks/use-setting-store'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { IUserSignIn } from '@/types'
import {
  signInWithCredentials,
  resendVerificationEmail,
  checkEmailVerification,
} from '@/lib/actions/user.actions'
import { toast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserSignInSchema } from '@/lib/validator'
import { isRedirectError } from 'next/dist/client/components/redirect-error'

export default function CredentialsSignInForm() {
  const {
    setting: { site },
  } = useSettingStore()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)
  const [lastResent, setLastResent] = useState<Date | null>(null)

  const form = useForm<IUserSignIn>({
    resolver: zodResolver(UserSignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { control, handleSubmit } = form

  const handleResendVerification = async () => {
    if (!unverifiedEmail || isResending) return

    try {
      setIsResending(true)
      const res = await resendVerificationEmail(unverifiedEmail, callbackUrl)

      if (res.success) {
        setLastResent(new Date())
        toast({
          title: 'Verification Email Sent',
          description:
            'Please check your inbox and spam folder for the verification link.',
        })
      } else {
        toast({
          title: 'Error',
          description:
            res.error || 'Failed to send verification email. Please try again.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsResending(false)
    }
  }

  const onSubmit = async (data: IUserSignIn) => {
    try {
      // Check if email is verified
      const verificationCheck = await checkEmailVerification(data.email)

      if (!verificationCheck.success) {
        if (verificationCheck.needsVerification) {
          setUnverifiedEmail(data.email)
        }
        toast({
          title: 'Error',
          description: verificationCheck.error,
          variant: 'destructive',
        })
        return
      }

      setUnverifiedEmail(null)
      await signInWithCredentials({
        email: data.email,
        password: data.password,
      })
      redirect(callbackUrl)
    } catch (error) {
      if (isRedirectError(error)) {
        throw error
      }
      toast({
        title: 'Error',
        description: 'Invalid email or password',
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type='hidden' name='callbackUrl' value={callbackUrl} />
        <div className='space-y-6'>
          <FormField
            control={control}
            name='email'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Enter email address' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='password'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Enter password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='space-y-4'>
            <Button type='submit'>Sign In</Button>
            {unverifiedEmail && (
              <div className='p-6 bg-blue-50 rounded-lg mt-4 border border-blue-100'>
                <div className='flex flex-col items-center text-center'>
                  <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
                    <svg
                      className='w-6 h-6 text-blue-600'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                      />
                    </svg>
                  </div>
                  <p className='text-blue-700 font-semibold text-lg mb-2'>
                    Email Verification Required
                  </p>
                  <p className='text-sm text-blue-600 mb-4'>
                    We noticed your email address ({unverifiedEmail})
                    hasn&apos;t been verified yet. Please check your inbox for
                    the verification email and click the link to verify your
                    account.
                  </p>
                  <div className='space-y-3'>
                    <Button
                      type='button'
                      variant='outline'
                      className='bg-white text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 w-full'
                      onClick={handleResendVerification}
                      disabled={isResending}
                    >
                      {isResending ? (
                        <span className='flex items-center gap-2'>
                          <svg
                            className='animate-spin h-4 w-4'
                            viewBox='0 0 24 24'
                          >
                            <circle
                              className='opacity-25'
                              cx='12'
                              cy='12'
                              r='10'
                              stroke='currentColor'
                              strokeWidth='4'
                              fill='none'
                            />
                            <path
                              className='opacity-75'
                              fill='currentColor'
                              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                            />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        'Resend Verification Email'
                      )}
                    </Button>
                    <p className='text-xs text-blue-500'>
                      {lastResent
                        ? `Last sent: ${lastResent.toLocaleTimeString()}`
                        : "Can't find the email? Check your spam folder or click the button above to send a new verification email."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className='text-sm'>
            By signing in, you agree to {site.name}&apos;s{' '}
            <Link href='/page/conditions-of-use'>Conditions of Use</Link> and{' '}
            <Link href='/page/privacy-policy'>Privacy Notice.</Link>
          </div>
        </div>
      </form>
    </Form>
  )
}
