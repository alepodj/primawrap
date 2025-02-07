'use client'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import useSettingStore from '@/hooks/use-setting-store'
import { useParams } from 'next/navigation'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { IUserSignUp } from '@/types'
import { registerUser } from '@/lib/actions/user.actions'
import { toast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserSignUpSchema } from '@/lib/validator'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Info } from 'lucide-react'
import { useTranslations } from 'next-intl'

const signUpDefaultValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

function PasswordStrengthIndicator({ password }: { password: string }) {
  const t = useTranslations('Locale')
  const requirements = [
    { regex: /.{8,}/, text: t('At least 8 characters') },
    { regex: /[A-Z]/, text: t('One uppercase letter') },
    { regex: /[a-z]/, text: t('One lowercase letter') },
    { regex: /[0-9]/, text: t('One number') },
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
          <span>{t('Password must contain')}:</span>
        </div>
        <ul className='ml-4 list-disc'>
          {requirements.map(({ text }, index) => (
            <li
              key={index}
              className={
                requirements[index].regex.test(password)
                  ? 'text-green-500'
                  : undefined
              }
            >
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function SignUpForm() {
  const {
    setting: { site },
  } = useSettingStore()
  const searchParams = useSearchParams()
  const { locale } = useParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const [isRegistered, setIsRegistered] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const currentLocale = typeof locale === 'string' ? locale : 'en-CA'
  const t = useTranslations('Locale')
  const form = useForm<IUserSignUp>({
    resolver: zodResolver(UserSignUpSchema),
    defaultValues: signUpDefaultValues,
  })

  const { control, handleSubmit } = form

  const onSubmit = async (data: IUserSignUp) => {
    try {
      setIsSubmitting(true)
      const res = await registerUser(data, callbackUrl)
      if (!res.success) {
        toast({
          title: t('Error'),
          description: res.error,
          variant: 'destructive',
        })
        return
      }
      setIsRegistered(true)
    } catch {
      toast({
        title: t('Error'),
        description: t('Something went wrong'),
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formContent = isRegistered ? (
    <Card>
      <CardHeader>
        <CardTitle>{t('Check your email')}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-muted-foreground'>
          {t('We sent you a verification link')} <br />
          {t('Please check your email to verify your account')}
        </p>
      </CardContent>
    </Card>
  ) : (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type='hidden' name='callbackUrl' value={callbackUrl} />
        <div className='space-y-6'>
          <FormField
            control={control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>{t('Full Name')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('Enter name')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='email'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>{t('Email')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('Enter email address')} {...field} />
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
                <FormLabel>{t('Password')}</FormLabel>
                <FormControl>
                  <div className='space-y-2'>
                    <div className='relative'>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('Enter password')}
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
                    <PasswordStrengthIndicator password={field.value} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>{t('Confirm Password')}</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={t('Confirm Password')}
                      {...field}
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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
          <div>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? t('Sending') : t('Sign Up')}
            </Button>
          </div>
          <div className='text-sm'>
            {t('By creating an account, you agree to')} {site.name}&apos;s{' '}
            <Link
              className='user-menu-link !text-primary'
              href='/page/conditions-of-use'
            >
              {t('Conditions of Use')}
            </Link>{' '}
            {t('and')}{' '}
            <Link
              className='user-menu-link !text-primary'
              href='/page/privacy-policy'
            >
              {t('Privacy Notice')}.{' '}
            </Link>
          </div>
          <Separator className='mb-4' />
          <div className='text-sm space-y-2'>
            <div>
              {t('Already have an account?')}{' '}
              <Link
                className='user-menu-link !text-primary'
                href={`/${currentLocale}/sign-in?callbackUrl=${callbackUrl}`}
              >
                {t('Sign In')}
              </Link>
            </div>
            <div>
              {t('Forgot your password?')}{' '}
              <Link
                className='user-menu-link !text-primary'
                href={`/${currentLocale}/forgot-password`}
              >
                {t('Reset it here')}
              </Link>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )

  return (
    <div className='mx-auto w-full max-w-[350px] space-y-6'>{formContent}</div>
  )
}
