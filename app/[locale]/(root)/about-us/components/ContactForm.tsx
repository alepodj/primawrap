'use client'

import { useState } from 'react'
import { TextField, Button, Stack, Alert, Paper } from '@mui/material'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    })
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: '600px', mx: 'auto' }}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {submitted && (
            <Alert severity='success'>
              Thank you for your message! We&apos;ll get back to you soon.
            </Alert>
          )}

          <TextField
            label='Name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label='Email'
            name='email'
            type='email'
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label='Subject'
            name='subject'
            value={formData.subject}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label='Message'
            name='message'
            value={formData.message}
            onChange={handleChange}
            required
            multiline
            rows={4}
            fullWidth
          />

          <Button type='submit' variant='contained' size='large' sx={{ mt: 2 }}>
            Send Message
          </Button>
        </Stack>
      </form>
    </Paper>
  )
}

export default ContactForm
