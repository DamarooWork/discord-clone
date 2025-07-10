import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from '@/shared/components'
import { hasLocale, Locale, NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { cn } from '@/shared/lib/utils/cn'
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
const openSans = Open_Sans({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | Discord by Damaroo',
    default: 'Discord by Damaroo',
  },
  description: 'Discord clone by Damaroo with Next.js and Tailwind CSS',
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}>) {
  const { locale } = await params
  const messages = await getMessages()
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn(openSans.className, 'dark:bg-[#313338]')}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
