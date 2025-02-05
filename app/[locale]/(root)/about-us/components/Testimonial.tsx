'use client'

import { Card, CardContent, Typography, Box, Rating, Grid } from '@mui/material'
import Image from 'next/image'

const testimonials = [
  {
    name: 'Michael Brown',
    company: 'Tech Solutions Inc.',
    image: '/images/testimonial1.jpg',
    rating: 5,
    text: 'Working with this team has been an absolute pleasure. Their attention to detail and commitment to excellence is unmatched.',
  },
  {
    name: 'Sarah Johnson',
    company: 'Creative Studios',
    image: '/images/testimonial2.jpg',
    rating: 5,
    text: 'They delivered beyond our expectations. Their innovative approach and professional service made our project a huge success.',
  },
]

const Testimonial = () => {
  return (
    <>
      {testimonials.map((testimonial, index) => (
        <Grid item xs={12} md={6} key={index}>
          <Card sx={{ display: 'flex', height: '100%' }}>
            <Box
              sx={{
                width: '40%',
                position: 'relative',
                minHeight: '300px',
              }}
            >
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                fill
                style={{ objectFit: 'cover' }}
              />
            </Box>
            <CardContent sx={{ width: '60%' }}>
              <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
              <Typography
                variant='body1'
                paragraph
                sx={{ fontStyle: 'italic' }}
              >
                &ldquo;{testimonial.text}&rdquo;
              </Typography>
              <Typography variant='h6' gutterBottom>
                {testimonial.name}
              </Typography>
              <Typography variant='subtitle2' color='text.secondary'>
                {testimonial.company}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </>
  )
}

export default Testimonial
