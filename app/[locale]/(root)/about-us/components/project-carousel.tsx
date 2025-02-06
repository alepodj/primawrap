'use client'

import * as React from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const ProjectCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 3,
    skipSnaps: false,
  })

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const projects = [
    '/images/store/store1.jpg',
    '/images/store/store2.jpg',
    '/images/store/store3.jpg',
    '/images/store/store4.jpg',
    '/images/store/store5.jpg',
    '/images/store/store6.jpg',
    '/images/store/store7.jpg',
  ]

  return (
    <div className='w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]'>
      <div className='relative'>
        <div className='overflow-hidden' ref={emblaRef}>
          <div className='flex'>
            {projects.map((project, index) => (
              <div key={index} className='flex-[0_0_33.333%] min-w-0'>
                <div className='h-64 md:h-80 lg:h-96 relative'>
                  <Image
                    src={project}
                    alt={`Project ${index + 1}`}
                    fill
                    className='object-cover'
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className='absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 shadow-lg hover:bg-white transition-colors z-10'
          onClick={scrollPrev}
        >
          <ChevronLeft className='h-6 w-6' />
        </button>

        <button
          className='absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 shadow-lg hover:bg-white transition-colors z-10'
          onClick={scrollNext}
        >
          <ChevronRight className='h-6 w-6' />
        </button>
      </div>
    </div>
  )
}

export default ProjectCarousel
