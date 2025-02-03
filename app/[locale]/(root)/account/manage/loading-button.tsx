'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ButtonProps } from '@/components/ui/button'

interface LoadingButtonProps extends ButtonProps {
  href?: string
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  skipLoading?: boolean
}

export function LoadingButton({
  href,
  variant = 'outline',
  className = '',
  children,
  onClick,
  skipLoading = false,
  ...props
}: LoadingButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (skipLoading) {
      if (onClick) onClick(e)
      return
    }

    setIsLoading(true)
    if (onClick) {
      await onClick(e)
    }
    if (href) {
      router.push(href)
    }
  }

  return (
    <Button
      className={`rounded-full w-32 ${className}`}
      variant={variant}
      onClick={handleClick}
      disabled={isLoading}
      {...props}
    >
      {isLoading && !skipLoading ? (
        <Loader2 className='h-4 w-4 animate-spin' />
      ) : (
        children
      )}
    </Button>
  )
}
