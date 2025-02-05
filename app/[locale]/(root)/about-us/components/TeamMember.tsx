'use client'

import { Grid, Card, CardContent, Typography, Box, Stack } from '@mui/material'
import Image from 'next/image'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TwitterIcon from '@mui/icons-material/Twitter'
import EmailIcon from '@mui/icons-material/Email'

const teamMembers = [
  {
    name: 'John Doe',
    role: 'CEO & Founder',
    image: '/images/team1.jpg',
    bio: 'With over 15 years of experience in the industry, John leads our company with vision and innovation.',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    email: 'john@example.com',
  },
  {
    name: 'Jane Smith',
    role: 'Creative Director',
    image: '/images/team2.jpg',
    bio: 'Jane brings creative excellence and strategic thinking to every project she oversees.',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    email: 'jane@example.com',
  },
]

const TeamMember = () => {
  return (
    <>
      {teamMembers.map((member, index) => (
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
                src={member.image}
                alt={member.name}
                fill
                style={{ objectFit: 'cover' }}
              />
            </Box>
            <CardContent sx={{ width: '60%' }}>
              <Typography variant='h5' gutterBottom>
                {member.name}
              </Typography>
              <Typography variant='subtitle1' color='primary' gutterBottom>
                {member.role}
              </Typography>
              <Typography variant='body2' paragraph>
                {member.bio}
              </Typography>
              <Stack direction='row' spacing={1}>
                <LinkedInIcon
                  sx={{ cursor: 'pointer' }}
                  onClick={() => window.open(member.linkedin)}
                />
                <TwitterIcon
                  sx={{ cursor: 'pointer' }}
                  onClick={() => window.open(member.twitter)}
                />
                <EmailIcon
                  sx={{ cursor: 'pointer' }}
                  onClick={() =>
                    (window.location.href = `mailto:${member.email}`)
                  }
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </>
  )
}

export default TeamMember
