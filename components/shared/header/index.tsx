import Image from 'next/image'
import Link from 'next/link'
import { getAllCategories } from '@/lib/actions/product.actions'
import Menu from './menu'
import Search from './search'
import data from '@/lib/data'
import Sidebar from './sidebar'
import { getSetting } from '@/lib/actions/setting.actions'
import { getTranslations } from 'next-intl/server'

export default async function Header() {
  const categories = await getAllCategories()
  const { site } = await getSetting()
  const t = await getTranslations()
  return (
    <header className='bg-gradient-to-tl from-slate-700 to-slate-900 text-white'>
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
      <div className='flex items-center px-3 mb-[1px] bg-gradient-to-tr from-slate-800 to-slate-600'>
        <Sidebar categories={categories} />
        <div className='flex items-center flex-wrap gap-3 overflow-hidden max-h-[42px]'>
          {data.headerMenus.map((menu) => (
            <Link href={menu.href} key={menu.href} className='nav-link px-2'>
              {t('Header.' + menu.name)}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
