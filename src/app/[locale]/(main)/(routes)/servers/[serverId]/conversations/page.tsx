
import { redirect } from '@/i18n/navigation'
import { prisma } from '@/shared/lib';
import { getLocale } from 'next-intl/server'

interface ConversationsPageProps {
  params: Promise<{ serverId: string; memberId: string }>
}
export default async function Conversations({ params }: ConversationsPageProps) {
  const { memberId, serverId } = await params
  if (!memberId) {
    const generalChannel = await prisma.channel.findFirst({
      where: {
        serverId,
        name: 'General',
      },
    })
    return redirect({ href: `/servers/${serverId}/channels/${generalChannel?.id}`, locale: await getLocale() })
  }
}
