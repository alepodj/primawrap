
import Image from 'next/image'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Container, Box } from '@mui/material'
import ContactForm from './components/contact-form'
import TeamMember from './components/team-member'
import Testimonial from './components/testimonials'
import ClientCarousel from './components/client-carousel'
import ProjectCarousel from './components/project-carousel'
import SocialLinks from './components/social-links'
import MapView from './components/map-view'
import ContactInfo from './components/contact-info'
import { getTranslations } from 'next-intl/server'

export default async function AboutPage() {
  const t = await getTranslations('Locale')
  return (
    <div className='about-page overflow-x-hidden'>
      {/* Section 1: Company Brand Banner */}
      <div className='relative w-full'>
        <div className='flex aspect-[4/3] sm:aspect-[16/6] items-center justify-center relative shadow-lg'>
          <Image
            src='/images/banner1.png'
            alt='Prima Wrap Banner'
            fill
            className='object-cover'
            priority
          />
        </div>
      </div>

      {/* Section 2: Client Carousel */}
      <div className='w-full p-4 sm:p-10 shadow-[inset_0_-4px_12px_rgba(0,0,0,0.2)]'>
        <h2 className='text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 text-gray-800 relative'>
          <span className='bg-gradient-to-r text-gray-700/80 text-gray-700 bg-clip-text'>
            {t('Our Clients')}
          </span>
          <div className='absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full'></div>
        </h2>
        <ClientCarousel />
      </div>

      {/* Section 3: Project Carousel */}
      <Box sx={{ my: 0 }}>
        {/* <h2 className='text-4xl font-bold text-center mb-8 text-gray-700'>
          Our Projects
        </h2> */}
        <ProjectCarousel />
      </Box>

      {/* Section 4: Company Info */}
      <div className='w-full bg-pink-50/80 py-6 sm:py-10 shadow-lg'>
        <Container maxWidth='md'>
          <div className='text-center px-4 sm:px-0'>
            <h2 className='text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 text-gray-800 relative'>
              <span className='bg-gradient-to-r text-gray-700/80 text-gray-700 bg-clip-text'>
                {t('Our Company')}
              </span>
              <div className='absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full'></div>
            </h2>
            <p className='text-base sm:text-xl mb-6 text-gray-600 text-justify'>
              {t('Prima Wrap is your premier destination for all gift packaging needs')}. 
              {t('From elegant printed bags and boxes to luxurious gift wrap, ribbons, and bows, we offer a comprehensive selection of packaging solutions')}.
              {t('We proudly feature exclusive collections and bring designer quality to your special occasions')}.
              {t('With our head office strategically located in Niagara-on-the-Lake, we serve customers across Ontario, from Toronto and Mississauga to the beautiful Niagara Falls region')}.
            </p>
            <h2 className='text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 text-gray-800 relative'>
              <span className='bg-gradient-to-r text-gray-700/80 text-gray-700 bg-clip-text'>
                {t('Our Mission')}
              </span>
              <div className='absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full'></div>
            </h2>
            <p className='text-base sm:text-xl text-gray-600 text-justify'>
              {t('To elevate every gift-giving moment by providing exceptional packaging solutions that combine quality, creativity, and elegance, while delivering outstanding service to our valued customers across Canada')}. 
              {t('Through our in-house capabilities including logo stamping and customization services, we eliminate intermediaries to offer cost-effective solutions without compromising on quality')}.
              {t('Our commitment to maintaining direct control over production ensures both competitive pricing and exceptional craftsmanship for our customers')}.
            </p>
          </div>
        </Container>
      </div>

      {/* Section 5: Meet the Team */}
      <div className='shadow-2xl py-4 shadow-[inset_0_-4px_12px_rgba(0,0,0,0.2)]'>
        <Container maxWidth='lg' sx={{ my: 4 }}>
          <h2 className='text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 text-gray-800 relative'>
            <span className='bg-gradient-to-r text-gray-700/80 text-gray-700 bg-clip-text'>
              {t('Meet the Team')}
            </span>
            <div className='absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full'></div>
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 px-4 sm:px-0'>
            <TeamMember />
          </div>
        </Container>
      </div>
      {/* Section 6: Testimonials */}
      <div className='w-full bg-pink-50/80 py-6 sm:py-10 shadow-lg'>
        <Container maxWidth='lg'>
          <div className='px-4 sm:px-0'>
            <h2 className='text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 text-gray-800 relative'>
              <span className='bg-gradient-to-r text-gray-700/80 text-gray-700 bg-clip-text'>
                {t('Testimonials')}
              </span>
              <div className='absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full'></div>
            </h2>
            <div className='flex items-center justify-center gap-2 mb-6 sm:mb-8'>
              <span className='text-xl sm:text-2xl font-bold text-gray-800'>
                4.7
              </span>
              <div className='flex gap-1'>
                <span className='text-yellow-400'>★</span>
                <span className='text-yellow-400'>★</span>
                <span className='text-yellow-400'>★</span>
                <span className='text-yellow-400'>★</span>
                <div className='relative inline-flex'>
                  <span className='text-gray-300'>★</span>
                  <div
                    className='absolute top-0 left-0 overflow-hidden'
                    style={{ width: '70%' }}
                  >
                    <span className='text-yellow-400'>★</span>
                  </div>
                </div>
              </div>
              <span className='text-gray-600'>(61 reviews)</span>
            </div>
            <Testimonial />
          </div>
        </Container>
      </div>

      {/* Section 7: Contact Form */}
      <div className='p-4 sm:p-10 shadow-[inset_0_-4px_12px_rgba(0,0,0,0.2)]'>
        <Container maxWidth='md' sx={{ my: 0 }}>
          <h2 className='text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 text-gray-800 relative'>
            <span className='bg-gradient-to-r text-gray-700/80 text-gray-700 bg-clip-text'>
              {t('Contact Us')}
            </span>
            <div className='absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full'></div>
          </h2>
          <ContactForm />
        </Container>
      </div>

      {/* Section 8: Footer Info */}
      <div className='w-full bg-gray-100 py-6 sm:py-10'>
        <div className='w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]'>
          <div className='max-w-1xl mx-auto px-4 sm:px-0'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <div className='flex justify-center items-start'>
                <SocialLinks />
              </div>
              <div className='flex justify-center items-start'>
                <MapView />
              </div>
              <div className='flex justify-center items-start'>
                <ContactInfo />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
