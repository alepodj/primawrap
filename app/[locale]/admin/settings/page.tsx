import { getNoCachedSetting } from '@/lib/actions/setting.actions'
import SettingForm from './setting-form'
import SettingNav from './setting-nav'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Setting',
}

const SettingPage = async () => {
  return (
    <div className='max-w-7xl mx-auto px-4'>
      <h1 className='text-3xl font-bold mb-6 mt-8'>Site Settings</h1>
      <div className='grid md:grid-cols-5 gap-6'>
        <div className='hidden md:block'>
          <div className='sticky top-24'>
            <SettingNav />
          </div>
        </div>
        <main className='col-span-5 md:col-span-4'>
          <SettingForm setting={await getNoCachedSetting()} />
        </main>
      </div>
    </div>
  )
}

export default SettingPage
