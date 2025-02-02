import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
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
    <div className='mb-24'>
      <SessionProvider session={session}>
        <div className='flex gap-2 '>
          <Link href='/account'>Your Account</Link>
          <span>›</span>
          <span>{PAGE_TITLE}</span>
        </div>
        <h1 className='h1-bold py-4'>{PAGE_TITLE}</h1>
        <Card className='max-w-2xl '>
          <CardContent className='p-4 flex justify-between flex-wrap'>
            <div>
              <h3 className='font-bold'>Name</h3>
              <p>{session?.user.name}</p>
            </div>
            <div>
              <Link href='/account/manage/name'>
                <Button className='rounded-full w-32' variant='outline'>
                  Edit
                </Button>
              </Link>
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
                  <Button className='rounded-full w-32' variant='outline'>
                    Notice
                  </Button>
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
              <Link href='/account/manage/phone'>
                <Button className='rounded-full w-32' variant='outline'>
                  Edit
                </Button>
              </Link>
            </div>
          </CardContent>
          <Separator />
          <CardContent className='p-4 flex justify-between flex-wrap'>
            <div>
              <h3 className='font-bold'>Password</h3>
              <p>************</p>
            </div>
            <div>
              <Link
                href={`/${locale}/forgot-password?email=${encodeURIComponent(session?.user.email || '')}`}
              >
                <Button className='rounded-full w-32' variant='outline'>
                  Reset
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </SessionProvider>
    </div>
  )
}
