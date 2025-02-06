'use client'

import { Facebook, Twitter, LinkedIn, Instagram } from '@mui/icons-material'

const socialLinks = [
  {
    name: 'Facebook',
    icon: Facebook,
    url: 'https://facebook.com',
    bgColor: 'bg-[#1877F2]',
  },
  {
    name: 'Twitter',
    icon: Twitter,
    url: 'https://twitter.com',
    bgColor: 'bg-[#1DA1F2]',
  },
  {
    name: 'LinkedIn',
    icon: LinkedIn,
    url: 'https://linkedin.com',
    bgColor: 'bg-[#0A66C2]',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://instagram.com',
    bgColor: 'bg-[#E4405F]',
  },
]

const SocialLinks = () => {
  return (
    <div className='text-center'>
      <h2 className='text-4xl font-bold text-center mb-8 text-gray-800 relative'>
            <span className='bg-gradient-to-r text-gray-700/80 text-gray-700 bg-clip-text'>
              Conect With Us
            </span>
            <div className='absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full'></div>
          </h2>
      <div className='flex flex-col items-center space-y-4'>
        {socialLinks.map((social) => {
          const Icon = social.icon
          return (
            <a
              key={social.name}
              href={social.url}
              target='_blank'
              rel='noopener noreferrer'
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${social.bgColor} text-white hover:opacity-90 transition-opacity`}
            >
              <Icon className='w-5 h-5' />
              <span>{social.name}</span>
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default SocialLinks
