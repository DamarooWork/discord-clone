
import { redirect } from '@/i18n/navigation'
import { getLocale } from 'next-intl/server'

interface ServersPageProps {
  params: Promise<{ serverId: string }>
}
export default async function Servers({ params }: ServersPageProps) {
  const { serverId } = await params
  if (!serverId) {
    return redirect({ href: '/', locale: await getLocale() })
  }
}
