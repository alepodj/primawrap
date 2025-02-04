'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Settings2, Timer } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function MaintenanceContent() {
  const router = useRouter()
  const { data: session } = useSession()

  return (
    <div className='w-full -mt-5'>
      <div className='container mx-auto'>
        <div className='text-center space-y-8'>
          {/* Animated Icon */}
          <div className='relative w-32 h-32 mx-auto'>
            <div className='absolute inset-0 animate-pulse'>
              <div className='absolute inset-0 bg-primary/10 rounded-full' />
            </div>
            <Timer className='w-32 h-32 text-primary/50' />
          </div>

          {/* Title */}
          <div className='space-y-6'>
            <h1 className='text-5xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50'>
              We&apos;ll be back soon!
            </h1>

            {/* Message */}
            <p className='text-xl text-muted-foreground mx-auto leading-relaxed'>
              We&apos;re currently performing maintenance to improve your
              experience. Thank you for your patience.
            </p>
          </div>

          {/* Admin Actions */}
          <div className='pt-8'>
            {session?.user?.role === 'Admin' ? (
              <Button
                variant='outline'
                onClick={() => router.push('/admin/overview')}
                className='hover:bg-primary hover:text-primary-foreground transition-colors'
              >
                <Settings2 className='w-4 h-4 mr-2' />
                Go to Admin Panel
              </Button>
            ) : (
              <Button
                variant='outline'
                onClick={() => router.push('/sign-in')}
                className='hover:bg-primary hover:text-primary-foreground transition-colors'
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
