'use client'

import { Box, Typography } from '@mui/material'

const MapView = () => {
  return (
    <Box>
      <Typography variant='h6' gutterBottom>
        Our Location
      </Typography>
      <Box
        sx={{
          width: '100%',
          height: '200px',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 1,
        }}
      >
        <iframe
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d216.30924372191714!2d-79.17166388425956!3d43.16125423122346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d35105b21c2b5d%3A0x40ad75af00dc093e!2sPrima%20Wrap!5e0!3m2!1sen!2sca!4v1738714270266!5m2!1sen!2sca"'
          width='100%'
          height='100%'
          style={{ border: 0 }}
          allowFullScreen
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
        />
      </Box>
      <Typography variant='body2' sx={{ mt: 1 }}>
        123 Business Street
        <br />
        City, State 12345
      </Typography>
    </Box>
  )
}

export default MapView
