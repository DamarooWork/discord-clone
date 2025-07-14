import { redirect } from '@/i18n/navigation'
import { prisma } from '@/shared/lib'
import { getLocale } from 'next-intl/server'
interface Props {
  serverId: string
}
export async function ServerPage({ serverId }: Props) {

 const server = await prisma.server.findUnique({
    where: {
      id: serverId,
    },
  })
  
  if (!server) {
    const locale = await getLocale()
    return redirect({ href: '/', locale })
  }
  return <> Server {server.name}</>
}
