import { Metadata } from 'next'
import WebPageForm from './web-page-form'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Create Web Page',
}

export default function CreateWebPagePage() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='icon' asChild>
            <Link href='/admin/web-pages'>
              <ArrowLeft className='h-5 w-5' />
            </Link>
          </Button>
          <h1 className='h1-bold'>Create Web Page</h1>
        </div>
      </div>

      <Card>
        <CardContent className='pt-6'>
          <WebPageForm type='Create' />
        </CardContent>
      </Card>
    </div>
  )
}
