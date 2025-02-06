'use client'

import * as React from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'

const ClientCarousel = () => {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      skipSnaps: false,
    },
    [
      AutoScroll({
        speed: 1,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  )

  const clients = [
    '/images/clients/client1.png',
    '/images/clients/client2.png',
    '/images/clients/client3.png',
    '/images/clients/client4.png',
    '/images/clients/client5.png',
    '/images/clients/client6.png',
    '/images/clients/client7.png',
    '/images/clients/client8.png',
    '/images/clients/client9.png',
    '/images/clients/client10.png',
    '/images/clients/client11.png',
    '/images/clients/client12.png',
    '/images/clients/client13.png',
    '/images/clients/client14.png',
    '/images/clients/client15.png',
    '/images/clients/client16.png',
    '/images/clients/client17.png',
    '/images/clients/client18.png',
    '/images/clients/client19.png',
    '/images/clients/client20.png',
    '/images/clients/client21.png',
    '/images/clients/client22.png',
    '/images/clients/client23.png',
    '/images/clients/client24.png',
    '/images/clients/client25.png',
    '/images/clients/client26.png',
    '/images/clients/client27.png',
    '/images/clients/client28.png',
    '/images/clients/client29.png',
    '/images/clients/client30.png',
  ]

  return (
    <div
      className='w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden'
      ref={emblaRef}
    >
      <div className='flex px-2 sm:px-4 md:px-8 lg:px-16'>
        {clients.map((client, index) => (
          <div
            key={index}
            className='flex-[0_0_50%] min-w-0 px-2 sm:flex-[0_0_33.333%] sm:px-4 md:flex-[0_0_25%] lg:flex-[0_0_20%]'
          >
            <div className='h-32 sm:h-40 md:h-48 lg:h-56 relative rounded-lg p-2 sm:p-6'>
              <Image
                src={client}
                alt={`Client ${index + 1}`}
                fill
                className='object-contain p-2 sm:p-4'
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ClientCarousel
