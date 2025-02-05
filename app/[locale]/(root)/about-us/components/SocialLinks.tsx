'use client'

import { Box, Typography, IconButton, Stack } from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import InstagramIcon from '@mui/icons-material/Instagram'

const socialLinks = [
  {
    name: 'Facebook',
    icon: FacebookIcon,
    url: 'https://facebook.com',
  },
  {
    name: 'Twitter',
    icon: TwitterIcon,
    url: 'https://twitter.com',
  },
  {
    name: 'LinkedIn',
    icon: LinkedInIcon,
    url: 'https://linkedin.com',
  },
  {
    name: 'Instagram',
    icon: InstagramIcon,
    url: 'https://instagram.com',
  },
]

const SocialLinks = () => {
  return (
    <Box>
      <Typography variant='h6' gutterBottom>
        Connect With Us
      </Typography>
      <Stack direction='row' spacing={1}>
        {socialLinks.map((social) => {
          const Icon = social.icon
          return (
            <IconButton
              key={social.name}
              color='primary'
              onClick={() => window.open(social.url, '_blank')}
              aria-label={social.name}
            >
              <Icon />
            </IconButton>
          )
        })}
      </Stack>
    </Box>
  )
}

export default SocialLinks
