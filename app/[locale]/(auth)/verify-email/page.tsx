import { redirect } from 'next/navigation'
import { verifyEmail } from '@/lib/actions/user.actions'
import VerificationResult from './verification-result'

export default async function VerifyEmailPage(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    token: string
    email?: string
    callbackUrl?: string
  }>
}) {
  const { locale } = await props.params
  const searchParams = await props.searchParams
  const { token, callbackUrl } = searchParams

  if (!token) {
    redirect('/')
  }

  try {
    const { success, error } = await verifyEmail(token)
    return (
      <VerificationResult
        success={success}
        error={error}
        locale={locale}
        callbackUrl={callbackUrl}
      />
    )
  } catch (error) {
    console.error('Error in verification page:', error)
    throw error
  }
}
