'use client'

import { useState } from 'react'
import { Mail, User, MessageSquare } from 'lucide-react'
import { useTranslations } from 'next-intl'

const ContactForm = () => {
  const t = useTranslations('Locale')
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
    <div className='max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8'>
      <form onSubmit={handleSubmit} className='space-y-6'>
        {submitted && (
          <div className='bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6 flex items-center'>
            <MessageSquare className='w-5 h-5 mr-2' />
            {t("Thank you for your message! We'll get back to you soon")}
          </div>

        )}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700'
            >
              {t('Name')}
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>

                <User className='h-5 w-5 text-gray-400' />
              </div>
              <input
                type='text'
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
                className='w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-colors bg-gray-50'
                placeholder={t('Your name')}
              />
            </div>
          </div>


          <div className='space-y-2'>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              {t('Email')}
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>

                <Mail className='h-5 w-5 text-gray-400' />
              </div>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
                className='w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-colors bg-gray-50'
                placeholder='@email.com'
              />
            </div>
          </div>
        </div>

        <div className='space-y-2'>
          <label
            htmlFor='subject'
            className='block text-sm font-medium text-gray-700'
          >
            {t('Subject')}
          </label>
          <div className='relative'>

            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <MessageSquare className='h-5 w-5 text-gray-400' />
            </div>
            <input
              type='text'
              id='subject'
              name='subject'
              value={formData.subject}
              onChange={handleChange}
              required
              className='w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-colors bg-gray-50'
              placeholder={t('How can we help?')}
            />
          </div>
        </div>


        <div className='space-y-2'>
          <label
            htmlFor='message'
            className='block text-sm font-medium text-gray-700'
          >
            {t('Message')}
          </label>
          <textarea

            id='message'
            name='message'
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-colors bg-gray-50 resize-none'
            placeholder={t('Tell us your thoughts')}
          />
        </div>


        <button
          type='submit'
          className='w-full md:w-auto px-8 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors duration-200 ease-in-out flex items-center justify-center gap-2'
        >
          <Mail className='w-5 h-5' />
          {t('Send Message')}
        </button>
      </form>
    </div>

  )
}

export default ContactForm
