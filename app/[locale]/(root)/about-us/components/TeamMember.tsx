'use client'

import Image from 'next/image'
import {
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
  Mail,
} from '@mui/icons-material'

const teamMembers = [
  {
    name: 'Domenic Gugliotta',
    role: 'CEO & Founder',
    image: '/images/team/team1.jpg',
    bio: 'With over 15 years of experience in the industry, Domenic leads our company with vision and innovation.',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    email: 'domenic@primawrap.com',
  },
  {
    name: 'Kelly Gugliotta',
    role: 'Founder & Creative Director',
    image: '/images/team/team2.jpg',
    bio: 'Kelly brings creative excellence and strategic thinking to every project she oversees.',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    email: 'kelly@primawrap.com',
  },
]

const TeamMember = () => {
  return (
    <>
      {teamMembers.map((member, index) => (
        <div key={index} className='w-full p-8'>
          <div className='text-center'>
            <div className='relative w-48 h-48 mx-auto mb-6'>
              <div className='absolute inset-0 rounded-full bg-gradient-to-b from-gray-200 to-gray-300'></div>
              <Image
                src={member.image}
                alt={member.name}
                fill
                className='object-cover rounded-full p-1'
              />
            </div>
            <h3 className='text-2xl font-bold text-gray-800 mb-1'>
              {member.name}
            </h3>
            <p className='text-primary font-medium mb-4'>{member.role}</p>
            <p className='text-gray-600 mb-6 max-w-sm mx-auto text-left'>{member.bio}</p>
            <div className='flex items-center justify-center gap-4'>
              <a
                href={member.facebook}
                target='_blank'
                rel='noopener noreferrer'
                className='w-8 h-8 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-90'
              >
                <Facebook className='w-4 h-4' />
              </a>
              <a
                href={member.instagram}
                target='_blank'
                rel='noopener noreferrer'
                className='w-8 h-8 flex items-center justify-center rounded-full bg-[#E4405F] text-white hover:opacity-90'
              >
                <Instagram className='w-4 h-4' />
              </a>
              <a
                href={member.twitter}
                target='_blank'
                rel='noopener noreferrer'
                className='w-8 h-8 flex items-center justify-center rounded-full bg-[#1DA1F2] text-white hover:opacity-90'
              >
                <Twitter className='w-4 h-4' />
              </a>
              <a
                href={member.linkedin}
                target='_blank'
                rel='noopener noreferrer'
                className='w-8 h-8 flex items-center justify-center rounded-full bg-[#0A66C2] text-white hover:opacity-90'
              >
                <LinkedIn className='w-4 h-4' />
              </a>
              <a
                href={`mailto:${member.email}`}
                className='w-8 h-8 flex items-center justify-center rounded-full bg-pink-500 text-white hover:opacity-90'
              >
                <Mail className='w-4 h-4' />
              </a>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default TeamMember
