'use client'

import * as React from 'react'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ICarousel } from '@/types'
import { useTranslations } from 'next-intl'

export function HomeCarousel({ items }: { items: ICarousel[] }) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )
  const t = useTranslations('Locale')

  React.useEffect(() => {
    if (!api) {
      return
    }

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <div className='relative'>
      <Carousel
        dir='ltr'
        plugins={[plugin.current]}
        className='w-full mx-auto'
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        setApi={setApi}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem key={item.title || item.image}>
              <Link href={item.url || '#'}>
                <div className='flex aspect-[16/6] items-center justify-center p-6 relative -m-1'>
                  <Image
                    src={item.image}
                    alt={item.title || 'Carousel image'}
                    fill
                    className='object-cover'
                    priority
                  />
                  {(item.title || item.buttonCaption) && (
                    <div className='absolute w-1/3 left-16 md:left-32 top-1/2 transform -translate-y-1/2'>
                      {item.title && (
                        <h2
                          className={cn(
                            'text-xl md:text-6xl font-bold mb-4 text-primary'
                          )}
                        >
                          {t(item.title)}
                        </h2>
                      )}
                      {item.buttonCaption && (
                        <Button className='hidden md:block'>
                          {t(item.buttonCaption)}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='left-0 md:left-12' />
        <CarouselNext className='right-0 md:right-12' />
      </Carousel>
      <div className='absolute bottom-4 left-0 right-0'>
        <div className='flex gap-2 justify-center'>
          {items.map((_, index) => (
            <button
              key={index}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                current === index ? 'w-8 bg-primary' : 'w-2 bg-primary/50'
              )}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
