import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ForgotPasswordForm from './forgot-password-form'
import { getTranslations } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Forgot Password',
}

export default async function ForgotPasswordPage() {
  const t = await getTranslations('Locale')
  return (
    <div className='w-full'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl text-center'>{t('Forgot Password')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </div>
  )
} 