'use client'

import Link from 'next/link'

interface NavLinkProps {
  href: string
  name: string
}

export default function NavLink({ href, name }: NavLinkProps) {
  return (
    <Link
      href={href}
      className='nav-link px-2'
      onClick={(e) => {
        if (href === '/#browsing-history') {
          e.preventDefault()
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth',
          })
        }
      }}
    >
      {name}
    </Link>
  )
}
