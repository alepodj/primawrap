import { ClientSetting, SiteCurrency } from '@/types'
import { create } from 'zustand'

interface SettingState {
  setting: ClientSetting
  setSetting: (newSetting: ClientSetting) => void
  getCurrency: () => SiteCurrency
  setCurrency: (currency: string) => void
}

const defaultSetting: ClientSetting = {
  common: {
    pageSize: 9,
    isMaintenanceMode: false,
    freeShippingMinPrice: 0,
    defaultTheme: 'light',
    defaultColor: 'purple',
  },
  site: {
    name: '',
    description: '',
    keywords: '',
    url: '',
    logo: '',
    slogan: '',
    author: '',
    copyright: '',
    email: '',
    address: '',
    phone: '',
  },
  headerMenus: [],
  carousels: [],
  availableLanguages: [],
  defaultLanguage: 'en-CA',
  availableCurrencies: [],
  defaultCurrency: 'CAD',
  currency: 'CAD',
  availablePaymentMethods: [],
  defaultPaymentMethod: '',
  availableDeliveryDates: [],
  defaultDeliveryDate: '',
}

const useSettingStore = create<SettingState>((set, get) => ({
  setting: defaultSetting,
  setSetting: (newSetting: ClientSetting) => {
    set({
      setting: {
        ...newSetting,
        currency: newSetting.currency || get().setting.currency,
      },
    })
  },
  getCurrency: () => {
    return (
      get().setting.availableCurrencies.find(
        (c) => c.code === get().setting.currency
      ) || {
        name: 'Canadian Dollar',
        code: 'CAD',
        convertRate: 1,
        symbol: '$',
      }
    )
  },
  setCurrency: async (currency: string) => {
    set({ setting: { ...get().setting, currency } })
  },
}))

export default useSettingStore
