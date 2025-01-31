export const i18n = {
  locales: [
    { code: 'en-CA', name: 'English (Canada)', icon: '🇨🇦' },
    { code: 'fr-CA', name: 'French (Canada)', icon: '🇫🇷' },
    { code: 'es', name: 'Spanish', icon: '🇪🇸' },
  ],
  defaultLocale: 'en-CA',
}

export const getDirection = (locale: string) => {
  return locale === 'ar' ? 'rtl' : 'ltr'
}
export type I18nConfig = typeof i18n
export type Locale = I18nConfig['locales'][number]
