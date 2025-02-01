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
import { resetPassword } from '@/lib/actions/user.actions'
import Link from 'next/link'
import { useSearchParams, useParams } from 'next/navigation'
import { Eye, EyeOff, Info } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

function PasswordStrengthIndicator({ password }: { password: string }) {
  const requirements = [
    { regex: /.{8,}/, text: 'At least 8 characters' },
    { regex: /[A-Z]/, text: 'One uppercase letter' },
    { regex: /[a-z]/, text: 'One lowercase letter' },
    { regex: /[0-9]/, text: 'One number' },
    { regex: /[^A-Za-z0-9]/, text: 'One special character' },
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
          <span>Password must contain:</span>
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

const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>

export default function ResetPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const searchParams = useSearchParams()
  const { locale } = useParams()
  const token = searchParams.get('token')

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
        title: 'Error',
        description: 'Invalid reset token',
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
          title: 'Success',
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

  if (isSuccess) {
    return (
      <div className='space-y-4 text-center'>
        <h2 className='text-lg font-semibold'>Password Reset Successful</h2>
        <p className='text-muted-foreground'>
          Your password has been reset successfully. You can now sign in with
          your new password.
        </p>
        <br />
        <Link href={`/${locale}/sign-in`}>
          <Button className='w-full'>Sign In</Button>
        </Link>
      </div>
    )
  }

  if (!token) {
    return (
      <div className='space-y-4 text-center'>
        <h2 className='text-lg font-semibold'>Invalid Reset Link</h2>
        <p className='text-muted-foreground'>
          This password reset link is invalid or has expired. Please request a
          new password reset link.
        </p>
        <Link href={`/${locale}/forgot-password`}>
          <Button className='w-full'>Request New Reset Link</Button>
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
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter new password'
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
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='Confirm new password'
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
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
    </Form>
  )
}
