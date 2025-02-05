'use client'

import { useState } from 'react'
import { Box, IconButton, Grid } from '@mui/material'
import Image from 'next/image'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const ProjectCarousel = () => {
  const projects = [
    '/images/project1.jpg',
    '/images/project2.jpg',
    '/images/project3.jpg',
    '/images/project4.jpg',
    '/images/project5.jpg',
    '/images/project6.jpg',
  ]

  const [startIndex, setStartIndex] = useState(0)

  const handlePrevious = () => {
    setStartIndex((prev) => Math.max(0, prev - 3))
  }

  const handleNext = () => {
    setStartIndex((prev) => Math.min(projects.length - 3, prev + 3))
  }

  return (
    <Box sx={{ position: 'relative', px: 6 }}>
      <IconButton
        onClick={handlePrevious}
        disabled={startIndex === 0}
        sx={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
        }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      <Grid container spacing={2}>
        {projects.slice(startIndex, startIndex + 3).map((project, index) => (
          <Grid item xs={12} md={4} key={startIndex + index}>
            <Box
              sx={{
                height: '250px',
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Image
                src={project}
                alt={`Project ${startIndex + index + 1}`}
                fill
                style={{ objectFit: 'cover' }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      <IconButton
        onClick={handleNext}
        disabled={startIndex >= projects.length - 3}
        sx={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  )
}

export default ProjectCarousel
