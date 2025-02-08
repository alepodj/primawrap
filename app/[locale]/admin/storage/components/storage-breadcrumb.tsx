'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface StorageBreadcrumbProps {
  currentPath: string
}

export default function StorageBreadcrumb({
  currentPath,
}: StorageBreadcrumbProps) {
  const pathParts = currentPath ? currentPath.split('/') : []

  return (
    <nav className='flex items-center space-x-2 text-base'>
      <Button
        variant='ghost'
        size='sm'
        className='h-auto p-2 text-base font-normal hover:bg-accent'
        asChild
      >
        <Link href='/admin/storage'>
          <Home className='h-5 w-5' />
        </Link>
      </Button>

      {pathParts.map((part, index) => {
        const path = pathParts.slice(0, index + 1).join('/')
        const isLast = index === pathParts.length - 1

        return (
          <div key={path} className='flex items-center'>
            <ChevronRight className='h-5 w-5 text-muted-foreground' />
            <Button
              variant='ghost'
              size='sm'
              className={cn(
                'h-auto p-2 text-base font-normal hover:bg-accent',
                isLast && 'text-foreground font-medium'
              )}
              asChild
            >
              <Link href={`/admin/storage${path ? `?path=${path}` : ''}`}>
                {part}
              </Link>
            </Button>
          </div>
        )
      })}
    </nav>
  )
}
