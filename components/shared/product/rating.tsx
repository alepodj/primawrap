// https://v0.dev/chat/PW7RbMctgbv
// PROMPT: create a rating component like amazon. only the star icons. it get rating as number and show stars based on it. it should cover all floating point numbers like 4.2, 4.5, 4.8

import React from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RatingProps } from '@/types'

export default function Rating({ rating, className, size = 4 }: RatingProps) {
  const fullStars = Math.floor(rating)
  const partialStar = rating % 1
  const sizeInPixels = size * 4 // Convert Tailwind size units to pixels (1 unit = 4px)

  return (
    <div className={cn('flex items-center', className)}>
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          return (
            <Star
              key={i}
              className='fill-primary text-primary'
              style={{ width: sizeInPixels, height: sizeInPixels }}
            />
          )
        }
        if (i === fullStars && partialStar > 0) {
          return (
            <div
              key={i}
              className='relative'
              style={{ width: sizeInPixels, height: sizeInPixels }}
            >
              <Star
                className='absolute text-muted-foreground'
                style={{ width: sizeInPixels, height: sizeInPixels }}
              />
              <div
                className='absolute overflow-hidden'
                style={{ width: `${partialStar * 100}%` }}
              >
                <Star
                  className='fill-primary text-primary'
                  style={{ width: sizeInPixels, height: sizeInPixels }}
                />
              </div>
            </div>
          )
        }
        return (
          <Star
            key={i}
            className='text-muted-foreground'
            style={{ width: sizeInPixels, height: sizeInPixels }}
          />
        )
      })}
    </div>
  )
}
