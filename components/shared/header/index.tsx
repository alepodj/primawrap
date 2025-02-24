import Link from 'next/link'
import Image from 'next/image'
import { getAllCategories } from '@/lib/actions/product.actions'
import Menu from './menu'
import Search from './search'
import Sidebar from './sidebar'
import { getSetting } from '@/lib/actions/setting.actions'
import NavLink from './nav-link'
import { getTranslations } from 'next-intl/server'
import { getLocale } from 'next-intl/server'

export default async function Header() {
  const categories = await getAllCategories()
  const { site, headerMenus } = await getSetting()
  const t = await getTranslations('Locale')
  const locale = await getLocale()

  return (
    <header className='bg-gradient-to-tl from-slate-700 to-slate-900 dark:from-slate-800 dark:to-slate-950 text-white'>
      <div className='px-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center md:w-auto w-full'>
            <Link
              href='/'
              className='flex items-center m-1 transition-opacity hover:opacity-80 md:ml-0 mx-auto'
            >
              <Image
                src={site.logo}
                width={150}
                height={150}
                alt={`${site.name} logo`}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
              {/* {site.name} */}
            </Link>
          </div>

          <div className='hidden xl:block flex-1 max-w-xl'>
            <Search />
          </div>
          <div className='hidden md:block'>
            <Menu />
          </div>
          <div className='md:hidden'>
            <Menu />
          </div>
        </div>
        <div className='xl:hidden block py-2'>
          <Search />
        </div>
      </div>
      <div className='flex items-center px-3 mb-[1px] bg-gradient-to-tr from-slate-800 to-slate-600 dark:from-slate-900 dark:to-slate-700'>
        <Sidebar categories={categories} locale={locale} />
        <div className='flex items-center flex-wrap gap-3 overflow-hidden max-h-[42px]'>
          {headerMenus?.map((menu) => (
            <NavLink key={menu.href} href={menu.href} name={t(menu.name)} />
          )) || null}
        </div>
      </div>
    </header>
  )
}
