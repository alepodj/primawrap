import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { verifyEmail } from '@/lib/actions/user.actions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle2, XCircle } from 'lucide-react'

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
    // Verify the email
    const { success, error } = await verifyEmail(token)

    return (
      <div className='container max-w-lg mx-auto py-10'>
        <Card className='text-center'>
          <CardHeader>
            <div className='flex justify-center mb-4'>
              {success ? (
                <CheckCircle2 className='h-12 w-12 text-green-500' />
              ) : (
                <XCircle className='h-12 w-12 text-red-500' />
              )}
            </div>
            <CardTitle className='text-2xl'>
              {success
                ? 'Email Verification Successful!'
                : 'Verification Failed'}
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground'>
              {success ? (
                <>
                  Your email has been verified successfully. You can now sign in
                  to your account.
                </>
              ) : (
                error ||
                'The verification link is invalid or has expired. Please request a new verification link.'
              )}
            </p>
            <div className='flex flex-col gap-2'>
              <Link
                href={`/${locale}/sign-in${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
                className='mx-auto'
              >
                <Button variant='default'>
                  {success ? 'Sign In to Your Account' : 'Back to Sign In'}
                </Button>
              </Link>
              {!success && (
                <Link href={`/${locale}/sign-up`} className='mx-auto'>
                  <Button variant='outline'>Create New Account</Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error('Error in verification page:', error)
    throw error
  }
}
