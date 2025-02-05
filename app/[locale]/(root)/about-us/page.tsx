'use client'

import Image from 'next/image'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Container, Box, Grid } from '@mui/material'
import ContactForm from './components/ContactForm'
import TeamMember from './components/TeamMember'
import Testimonial from './components/Testimonial'
import ClientCarousel from './components/ClientCarousel'
import ProjectCarousel from './components/ProjectCarousel'
import SocialLinks from './components/SocialLinks'
import MapView from './components/MapView'
import ContactInfo from './components/ContactInfo'

export default function AboutPage() {
  return (
    <div className='about-page overflow-x-hidden'>
      {/* Section 2: Company Brand Banner */}
      <div className='relative w-full'>
        <div className='flex aspect-[16/6] items-center justify-center relative shadow-lg'>
          <Image
            src='/images/banner1.png'
            alt='Prima Wrap Banner'
            fill
            className='object-cover'
            priority
          />
        </div>
      </div>

      {/* Section 3: Client Carousel */}
      <div className='w-full my-16'>
        <h2 className='text-4xl font-bold text-center mb-8'>Our Clients</h2>
        <ClientCarousel />
      </div>

      {/* Section 4: Company Info */}
      <Container maxWidth='md' sx={{ my: 8 }}>
        <div className='text-center'>
          <h2 className='text-4xl font-bold mb-6'>About Our Company</h2>
          <p className='text-lg mb-6'>
            We are a dedicated team of professionals committed to delivering
            exceptional products and services to our clients. With years of
            experience in the industry, we have built a reputation for
            excellence and innovation.
          </p>
          <h3 className='text-3xl font-bold mt-8 mb-4'>Our Mission</h3>
          <p className='text-lg'>
            To provide outstanding value and service while maintaining the
            highest standards of quality and professionalism in everything we
            do.
          </p>
        </div>
      </Container>

      {/* Section 5: Project Carousel */}
      <Box sx={{ my: 8 }}>
        <h2 className='text-4xl font-bold text-center mb-8'>Our Projects</h2>
        <ProjectCarousel />
      </Box>

      {/* Section 6: Meet the Team */}
      <Container maxWidth='lg' sx={{ my: 8 }}>
        <h2 className='text-4xl font-bold text-center mb-8'>Meet the Team</h2>
        <Grid container spacing={4}>
          <TeamMember />
        </Grid>
      </Container>

      {/* Section 7: Testimonials */}
      <Container maxWidth='lg' sx={{ my: 8 }}>
        <h2 className='text-4xl font-bold text-center mb-8'>
          What Our Clients Say
        </h2>
        <Grid container spacing={4}>
          <Testimonial />
        </Grid>
      </Container>

      {/* Section 8: Contact Form */}
      <Container maxWidth='md' sx={{ my: 8 }}>
        <h2 className='text-4xl font-bold text-center mb-8'>Contact Us</h2>
        <ContactForm />
      </Container>

      {/* Section 9: Footer Info */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth='lg'>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <SocialLinks />
            </Grid>
            <Grid item xs={12} md={4}>
              <MapView />
            </Grid>
            <Grid item xs={12} md={4}>
              <ContactInfo />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  )
}
