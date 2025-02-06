'use client'

import SettingNav from './setting-nav'
import SettingForm from './setting-form'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { getNoCachedSetting } from '@/lib/actions/setting.actions'
import { useEffect, useState } from 'react'
import { ISettingInput } from '@/types'

const SettingPage = () => {
  const [setting, setSetting] = useState<ISettingInput | null>(null)
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [settingData, maintenanceData] = await Promise.all([
          getNoCachedSetting(),
          fetch('/api/settings/maintenance').then((res) => res.json()),
        ])
        setSetting(settingData)
        setIsMaintenanceMode(maintenanceData.enabled)
      } catch (error) {
        console.error('Error loading settings:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  if (isLoading || !setting) return null

  return (
    <div className='max-w-7xl mx-auto px-4'>
      <h1 className='text-3xl font-bold mb-6 mt-8'>Site Settings</h1>
      <div className='grid grid-cols-12 gap-4'>
        <div className='col-span-12 nav:col-span-2 sticky top-0 nav:top-[5.5rem] h-fit z-40 nav:pt-4'>
          <SettingNav />
        </div>
        <main className='col-span-12 nav:col-span-10 py-4 relative z-0'>
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-medium'>Maintenance Mode</h3>
                <p className='text-sm text-muted-foreground'>
                  Enable maintenance mode to temporarily restrict access to the
                  site
                </p>
              </div>
              <Switch
                name='isMaintenanceMode'
                checked={isMaintenanceMode}
                onCheckedChange={async (checked) => {
                  try {
                    setIsMaintenanceMode(checked)
                    const response = await fetch('/api/settings/maintenance', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ enabled: checked }),
                    })
                    if (!response.ok) {
                      // If the request fails, revert the UI state
                      setIsMaintenanceMode(!checked)
                      throw new Error('Failed to update maintenance mode')
                    }
                  } catch (error) {
                    console.error('Error updating maintenance mode:', error)
                    // You might want to show a toast notification here
                  }
                }}
              />
            </div>

            <Separator />
            <SettingForm setting={setting} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default SettingPage
