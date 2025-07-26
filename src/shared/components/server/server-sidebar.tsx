import { redirect } from '@/i18n/navigation'
import { prisma } from '@/shared/lib'
import { getLocale } from 'next-intl/server'
import { ScrollArea, Separator } from '@/shared/ui'
import {
  ServerChannels,
  ServerHeader,
  ServerMembers,
  ServerSearch,
} from '@/shared/components/server'
import { cn } from '@/shared/lib/utils'

interface ServerSidebarProps {
  serverId: string
  profileId: string
  sheet?: boolean
}

export async function ServerSidebar({
  serverId,
  profileId,
  sheet = false,
}: ServerSidebarProps) {
  const server = await prisma.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId,
        },
      },
    },
    include: {
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
      channels: {
        include: {
          profile: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  })

  if (!server) {
    return redirect({ href: '/', locale: await getLocale() })
  }
  const role = server.members.find(
    (member) => member.profileId === profileId
  )?.role

  return (
    <aside className={cn("fixed ml-18 h-full max-h-screen w-60 z-20 flex-col inset-0", !sheet && 'hidden md:flex ')}>
      <section className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
        <ServerHeader server={server} role={role} />
        <ServerSearch server={server} />
        <Separator />
        <ScrollArea className="flex-1 p-3 max-w-full w-full">
          <ServerChannels server={server} role={role} />
          <ServerMembers server={server} role={role} profileId={profileId} />
        </ScrollArea>
      </section>
    </aside>
  )
}
