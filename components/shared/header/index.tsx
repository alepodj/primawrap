import Image from 'next/image'
import Link from 'next/link'
import { getAllCategories } from '@/lib/actions/product.actions'
import Menu from './menu'
import Search from './search'
import Sidebar from './sidebar'
import { getSetting } from '@/lib/actions/setting.actions'
import NavLink from './nav-link'

export default async function Header() {
  const categories = await getAllCategories()
  const { site, headerMenus } = await getSetting()
  return (
    <header className='bg-gradient-to-tl from-slate-700 to-slate-900 dark:from-slate-800 dark:to-slate-950 text-white'>
      <div className='px-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <Link
              href='/'
              className='flex items-center m-1 transition-opacity hover:opacity-80'
            >
              <Image
                src={site.logo}
                width={150}
                height={150}
                alt={`${site.name} logo`}
              />
              {/* {site.name} */}
            </Link>
          </div>

          <div className='hidden md:block flex-1 max-w-xl'>
            <Search />
          </div>
          <Menu />
        </div>
        <div className='md:hidden block py-2'>
          <Search />
        </div>
      </div>
      <div className='flex items-center px-3 mb-[1px] bg-gradient-to-tr from-slate-800 to-slate-600 dark:from-slate-900 dark:to-slate-700'>
        <Sidebar categories={categories} />
        <div className='flex items-center flex-wrap gap-3 overflow-hidden max-h-[42px]'>
          {headerMenus?.map((menu) => (
            <NavLink key={menu.href} href={menu.href} name={menu.name} />
          )) || null}
        </div>
      </div>
    </header>
  )
}
