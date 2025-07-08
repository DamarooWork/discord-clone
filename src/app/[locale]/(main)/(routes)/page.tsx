import { Locale } from 'next-intl'
import { HomePage } from '@/views/home-page'

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  return <HomePage params={params} />
}
