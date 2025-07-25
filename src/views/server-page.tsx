import { redirect } from '@/i18n/navigation'
import { prisma } from '@/shared/lib'
import { getLocale } from 'next-intl/server'
interface Props {
  serverId: string
}
export async function ServerPage({ serverId }: Props) {
  const generalChannel = await prisma.channel.findFirst({
    where: {
      serverId,
      name: 'General',
    },
  })
  if (generalChannel) {
    return redirect({
      href: `/servers/${serverId}/channels/${generalChannel?.id}`,
      locale: await getLocale(),
    })
  }
  return <> </>
}
