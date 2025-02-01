export const i18n = {
  locales: [
    {
      code: 'en-CA',
      name: 'English',
      icon: '🇨🇦',
      flagImg: '/flags/ca.svg',
    },
    {
      code: 'fr-CA',
      name: 'French',
      icon: '🇫🇷',
      flagImg: '/flags/fr.svg',
    },
    {
      code: 'es',
      name: 'Spanish',
      icon: '🇪🇸',
      flagImg: '/flags/es.svg',
    },
  ],
  defaultLocale: 'en-CA',
}

export const getDirection = (locale: string) => {
  return locale === 'ar' ? 'rtl' : 'ltr'
}
export type I18nConfig = typeof i18n
export type Locale = I18nConfig['locales'][number]
