import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { DeleteAccountForm } from './delete-account-form'
import { LoadingButton } from './loading-button'

export const metadata: Metadata = {
  title: 'Manage Account',
}

const PAGE_TITLE = 'Login & Security'

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await auth()
  return (
    <div>
      <SessionProvider session={session}>
        <div className='flex gap-2 '>
          <Link href='/account' className='content-link dark:footer-link'>Your Account</Link>
          <span>›</span>
          <span>{PAGE_TITLE}</span>
        </div>
        <h1 className='h1-bold py-4'>{PAGE_TITLE}</h1>
        <Card>
          <CardContent className='p-4 flex justify-between flex-wrap'>
            <div>
              <h3 className='font-bold'>Name</h3>
              <p>{session?.user.name}</p>
            </div>
            <div>
              <LoadingButton href='/account/manage/name'>Edit</LoadingButton>
            </div>
          </CardContent>
          <Separator />
          <CardContent className='p-4 flex justify-between flex-wrap'>
            <div>
              <h3 className='font-bold'>Email</h3>
              <p>{session?.user.email}</p>
            </div>
            <div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <LoadingButton skipLoading>Notice</LoadingButton>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Email Change Not Allowed
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Email addresses cannot be changed on existing accounts. If
                      you need to use a different email address, please create a
                      new account with the new email.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction>OK</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
          <Separator />
          <CardContent className='p-4 flex justify-between flex-wrap'>
            <div>
              <h3 className='font-bold'>Phone</h3>
              <p>{session?.user.phone || 'Not set'}</p>
            </div>
            <div>
              <LoadingButton href='/account/manage/phone'>Edit</LoadingButton>
            </div>
          </CardContent>
          <Separator />
          <CardContent className='p-4 flex justify-between flex-wrap'>
            <div>
              <h3 className='font-bold'>Password</h3>
              <p>************</p>
            </div>
            <div>
              <LoadingButton
                href={`/${locale}/forgot-password?email=${encodeURIComponent(session?.user.email || '')}`}
              >
                Reset
              </LoadingButton>
            </div>
          </CardContent>
        </Card>
        <DeleteAccountForm />
      </SessionProvider>
    </div>
  )
}
