import { Inter } from 'next/font/google'
import '../globals.css'
import '../nprogress.css'
import ClientProviders from '@/components/shared/client-providers'
import { getDirection } from '@/i18n-config'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { getSetting } from '@/lib/actions/setting.actions'
import { cookies } from 'next/headers'
import { NavigationProgress } from '@/components/shared/navigation-progress'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'

const interSans = Inter({
  variable: '--font-inter-sans',
  subsets: ['latin'],
})

export async function generateMetadata() {
  const {
    site: { slogan, name, description, url },
  } = await getSetting()
  return {
    title: {
      template: `%s | ${name}`,
      default: `${name}. ${slogan}`,
    },
    description: description,
    metadataBase: new URL(url),
  }
}

export default async function AppLayout({
  params,
  children,
}: {
  params: { locale: string }
  children: React.ReactNode
}) {
  const setting = await getSetting()
  const currencyCookie = (await cookies()).get('currency')
  const currency = currencyCookie ? currencyCookie.value : 'CAD'
  const session = await auth()

  const { locale } = await params
  // Ensure that the incoming `locale` is valid
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      dir={getDirection(locale) === 'rtl' ? 'rtl' : 'ltr'}
      suppressHydrationWarning
    >
      <body className={`min-h-screen ${interSans.variable} antialiased`}>
        <SessionProvider
          session={session}
          refetchInterval={0}
          refetchOnWindowFocus={true}
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ClientProviders setting={{ ...setting, currency }}>
              <NavigationProgress />
              {children}
            </ClientProviders>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
