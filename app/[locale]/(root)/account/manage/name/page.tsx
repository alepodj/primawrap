import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { NameForm } from './name-form'
import { getSetting } from '@/lib/actions/setting.actions'

const PAGE_TITLE = 'Change Your Name'
export const metadata: Metadata = {
  title: PAGE_TITLE,
}

export default async function NamePage() {
  const session = await auth()
  const { site } = await getSetting()
  return (
    <div className='mb-24'>
      <SessionProvider session={session}>
        <div className='flex gap-2 '>
          <Link href='/account'>Your Account</Link>
          <span>›</span>
          <Link href='/account/manage'>Login & Security</Link>
          <span>›</span>
          <span>{PAGE_TITLE}</span>
        </div>
        <h1 className='h1-bold py-4'>{PAGE_TITLE}</h1>
        <Card>
          <CardContent className='p-4 flex justify-between flex-wrap'>
            <p className='text-sm py-2'>
              If you want to change the name associated with your {site.name}
              &apos;s account, you may do so below. Be sure to click the Save
              Changes button when you are done.
            </p>
            <NameForm />
          </CardContent>
        </Card>
      </SessionProvider>
    </div>
  )
}
