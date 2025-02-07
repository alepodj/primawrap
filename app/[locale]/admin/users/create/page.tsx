import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import UserRegisterForm from './user-register-form'

export const metadata: Metadata = {
  title: 'Create User',
}

export default function CreateUserPage() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='icon' asChild>
            <Link href='/admin/users'>
              <ArrowLeft className='h-5 w-5' />
            </Link>
          </Button>
          <h1 className='h1-bold'>Create User</h1>
        </div>
      </div>

      <Card>
        <CardContent className='pt-6'>
          <UserRegisterForm />
        </CardContent>
      </Card>
    </div>
  )
}
