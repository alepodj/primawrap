import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ResetPasswordForm from './reset-password-form'
import { getTranslations } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Reset Password',
}


export default async function ResetPasswordPage() {
  const t = await getTranslations('Locale')
  return (
    <div className='w-full'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl text-center'>{t('Reset Password')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}
