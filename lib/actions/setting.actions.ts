'use server'
import { ISettingInput } from '@/types'
import Setting from '../db/models/setting.model'
import { connectToDatabase } from '../db'
import { formatError } from '../utils'
import { cookies } from 'next/headers'

const defaultSetting: ISettingInput = {
  common: {
    pageSize: 9,
    isMaintenanceMode: false,
    freeShippingMinPrice: 0,
    defaultTheme: 'light',
    defaultColor: 'purple',
  },
  site: {
    name: 'Prima Wrap',
    description: 'Prima Wrap is your first choice in gift packaging',
    keywords: 'Prima Wrap, Gift Packaging',
    url: 'https://primawrap.vercel.app',
    logo: '/icons/prima-wrap.png',
    slogan: 'Family Owned, Quality Driven',
    author: 'Prima Wrap',
    copyright: '2025, Primawrap.com, Inc. or its affiliates',
    email: 'primawrap@primawrap.com',
    address: '360 York Rd, Niagara-on-the-Lake, ON L0S 1J0, Canada',
    phone: '+1 (905) 704-0087',
  },
  headerMenus: [
    {
      name: "Today's Deals",
      href: '/search?tag=todays-deal',
    },
    {
      name: 'New Arrivals',
      href: '/search?tag=new-arrivals',
    },
    {
      name: 'Featured Products',
      href: '/search?tag=featured-products',
    },
    {
      name: 'Best Sellers',
      href: '/search?tag=best-sellers',
    },
    {
      name: 'Browsing History',
      href: '/search?tag=browsing-history',
    },
    {
      name: 'About Us',
      href: '/page/about-us',
    },
    {
      name: 'Help',
      href: '/page/help',
    },
  ],
  carousels: [
    {
      title: '',
      buttonCaption: '',
      image: '/images/banner1(future).png',
      url: '',
    },
  ],
  availableLanguages: [
    { name: 'English', code: 'en-CA' },
    { name: 'Français', code: 'fr-CA' },
    { name: 'Español', code: 'es-ES' },
  ],
  defaultLanguage: 'en-CA',
  availableCurrencies: [
    {
      name: 'Canadian Dollar',
      code: 'CAD',
      convertRate: 1,
      symbol: '$',
    },
  ],
  defaultCurrency: 'CAD',
  availablePaymentMethods: [
    { name: 'PayPal', commission: 0 },
    { name: 'Credit Card', commission: 0 },
    { name: 'Pickup', commission: 0 },
  ],
  defaultPaymentMethod: 'Credit Card',
  availableDeliveryDates: [],
  defaultDeliveryDate: '',
}

const globalForSettings = global as unknown as {
  cachedSettings: ISettingInput | null
}

export const getNoCachedSetting = async (): Promise<ISettingInput> => {
  await connectToDatabase()
  const setting = await Setting.findOne()
  return JSON.parse(JSON.stringify(setting)) as ISettingInput
}

export const getSetting = async (): Promise<ISettingInput> => {
  if (!globalForSettings.cachedSettings) {
    console.log('hit db')
    await connectToDatabase()
    const setting = await Setting.findOne().lean()
    globalForSettings.cachedSettings = setting
      ? JSON.parse(JSON.stringify(setting))
      : defaultSetting
  }
  return globalForSettings.cachedSettings as ISettingInput
}

export const updateSetting = async (newSetting: ISettingInput) => {
  try {
    await connectToDatabase()
    const updatedSetting = await Setting.findOneAndUpdate({}, newSetting, {
      upsert: true,
      new: true,
    }).lean()
    globalForSettings.cachedSettings = JSON.parse(
      JSON.stringify(updatedSetting)
    ) // Update the cache
    return {
      success: true,
      message: 'Setting updated successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// Server action to update the currency cookie
export const setCurrencyOnServer = async (newCurrency: string) => {
  'use server'
  const cookiesStore = await cookies()
  cookiesStore.set('currency', newCurrency)

  return {
    success: true,
    message: 'Currency updated successfully',
  }
}
