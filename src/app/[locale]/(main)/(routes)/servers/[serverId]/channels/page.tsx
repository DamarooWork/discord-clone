
import { redirect } from '@/i18n/navigation'
import { prisma } from '@/shared/lib';
import { getLocale } from 'next-intl/server'

interface ChannelsPageProps {
  params: Promise<{ serverId: string; channelId: string }>
}
export default async function Channels({ params }: ChannelsPageProps) {
  const { channelId, serverId } = await params
  if (!channelId) {
    const generalChannel = await prisma.channel.findFirst({
      where: {
        serverId,
        name: 'General',
      },
    })
    return redirect({ href: `/servers/${serverId}/channels/${generalChannel?.id}`, locale: await getLocale() })
  }
}
