'use client'

import Image from 'next/image'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useCallback } from 'react'

const testimonials = [
  {
    name: 'Caitlin Kwolek',
    company: 'Local Guide',
    image: '/images/testimonials/testimonial1.png',
    rating: 5,
    text: "They are the absolute best here! The customer service is fantastic and so is the selection. If you're in need of bulk bags or supplies for holidays and events, this is the place to go.",
  },
  {
    name: 'Christine Monfriese',
    company: '',
    image: '/images/testimonials/testimonial2.png',
    rating: 5,
    text: "If you're looking for quality product packaging and customized printing, Prima Wrap in Niagara-On-The-Lake, Ontario is definitely the place. They did an excellent job printing my company logo my rum ball boxes.The staff is amazing and they take the time to understand your needs and offer great suggestions. @MonfrieseRumCakes",
  },
  {
    name: 'Danielle Shier',
    company: '',
    image: '/images/testimonials/testimonial3.png',
    rating: 5,
    text: "I can't say enough in praise of Kelly and her staff!  They are always responsive, kind, knowledgeable, and go above and beyond to make sure my business packaging needs are met, even on a tight deadline!  After working with a number of packaging suppliers, I have never found fair pricing, customized offerings, or five star customer service to match Prima Wrap's.",
  },
  {
    name: 'Tricia Panunte',
    company: '',
    image: '/images/testimonials/testimonial4.png',
    rating: 5,
    text: 'My daughter and I both have side hustles….I love that Prima wrap (Kelly) was able to get us different size bags for our customers orders.  She was fantastic with all our questions and even offered up other items to help out our side hustles.  Prices and selection were great!',
  },
  {
    name: 'Gabriella Lanzillotta',
    company: 'Local Guide',
    image: '/images/testimonials/testimonial5.png',
    rating: 5,
    text: 'Amazing customer service. Just left there with boxes for my sisters shower. The rep was so helpful and did not mind at all going through options to help us make it as cost effective as possible for us. Will definitely be returning here in the future for all our wrapping needs for the wedding and future events.',
  },
  {
    name: 'Julie Trothen Karanfilis',
    company: 'Local Guide',
    image: '/images/testimonials/testimonial6.png',
    rating: 5,
    text: "While running my small business, I have always shopped local for my supplies. This is one of the BEST packaging stores in the area, and even if it was 2-3 hours away...  I WOULD STILL SHOP THERE! I absolutely a 'tactile' shopper, and buying online for customer touch points is HARD. I LOVE that (before pandemic) I could go in and feel all the textures, thickness and quality before making a purchase. They only stock high-quality, so if you are online shopping, rest-assured that you are getting a quality product from them. Bracelet boxes, merch sleeves, all gift bags, cello bags, elastic wraps, larger gift/hat/storage boxes are all top quality. There is a little bit of everything. So thankful for their attentive staff, and always leave there feeling like a valued and supported customer.",
  },
]

const Testimonial = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slidesToScroll: 2,
      skipSnaps: false,
    },
    [
      Autoplay({
        delay: 3000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  )

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className='relative w-screen -ml-[50vw] -mr-[50vw] left-1/2 right-1/2'>
      <div className='overflow-hidden' ref={emblaRef}>
        <div className='flex'>
          {testimonials.map((testimonial, index) => (
            <div key={index} className='flex-[0_0_50%] min-w-0 px-2'>
              <div className='flex flex-col md:flex-row overflow-hidden h-full'>
                <div className='w-full md:w-2/5 relative p-4 flex md:items-start items-center justify-center'>
                  <div className='relative w-40 h-40 rounded-full overflow-hidden'>
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className='object-cover'
                    />
                  </div>
                </div>
                <div className='w-full md:w-3/5 p-6'>
                  <div className='flex gap-1 mb-4'>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className='w-5 h-5 fill-yellow-400 text-yellow-400'
                      />
                    ))}
                  </div>
                  <p className='text-gray-700 italic mb-4'>
                    &quot;{testimonial.text}&quot;
                  </p>
                  <h3 className='text-xl font-semibold text-gray-800 mb-1'>
                    {testimonial.name}
                  </h3>
                  <p className='text-sm text-gray-600'>{testimonial.company}</p>
                </div>
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
  )
}

export default Testimonial
