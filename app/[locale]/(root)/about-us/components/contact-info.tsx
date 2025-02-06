'use client'

import { Mail, Phone, MapPin } from 'lucide-react'

const ContactInfo = () => {
  return (
    <div className='text-center'>
      <div className='space-y-6'>
        <div className='flex flex-col items-center gap-2'>
          <div className='w-10 h-10 flex items-center justify-center rounded-full bg-primary/10'>
            <Mail className='w-5 h-5 text-primary' />
          </div>
          <a
            href='mailto:info@primawrap.com'
            className='text-gray-600 hover:text-primary transition-colors'
          >
            info@primawrap.com
          </a>
        </div>
        <div className='flex flex-col items-center gap-2'>
          <div className='w-10 h-10 flex items-center justify-center rounded-full bg-primary/10'>
            <Phone className='w-5 h-5 text-primary' />
          </div>
          <a
            href='tel:+19057040087'
            className='text-gray-600 hover:text-primary transition-colors'
          >
            +1 (905) 704-0087
          </a>
        </div>
        <div className='flex flex-col items-center gap-2'>
          <div className='w-10 h-10 flex items-center justify-center rounded-full bg-primary/10'>
            <MapPin className='w-5 h-5 text-primary' />
          </div>
          <address className='text-gray-600 not-italic text-center'>
            360 York Rd, Niagara-on-the-Lake,
            <br />
            ON L0S 1J0, Canada
          </address>
        </div>
      </div>
    </div>
  )
}

export default ContactInfo
