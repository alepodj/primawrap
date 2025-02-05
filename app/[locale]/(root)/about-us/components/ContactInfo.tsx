'use client'

import { Box, Typography, Stack } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'

const ContactInfo = () => {
  return (
    <Box>
      <Typography variant='h6' gutterBottom>
        Contact Information
      </Typography>
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmailIcon color='primary' />
          <Typography variant='body2'>Email: contact@example.com</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PhoneIcon color='primary' />
          <Typography variant='body2'>Phone: +1 (555) 123-4567</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationOnIcon color='primary' />
          <Typography variant='body2'>
            Address: 123 Business Street
            <br />
            City, State 12345
          </Typography>
        </Box>
      </Stack>
    </Box>
  )
}

export default ContactInfo
