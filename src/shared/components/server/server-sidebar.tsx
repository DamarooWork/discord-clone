import { redirect } from '@/i18n/navigation'
import { currentProfile, prisma } from '@/shared/lib'
import { getLocale } from 'next-intl/server'
import { ScrollArea, Separator } from '@/shared/ui'
import {
  ServerChannels,
  ServerHeader,
  ServerMembers,
  ServerSearch,
} from '@/shared/components/server'

interface ServerSidebarProps {
  serverId: string
}

export async function ServerSidebar({ serverId }: ServerSidebarProps) {
  const profile = await currentProfile()
  if (!profile) {
    return redirect({ href: '/', locale: await getLocale() })
  }

  const server = await prisma.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
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
    (member) => member.profileId === profile.id
  )?.role

 
  return (
    <section className="hidden fixed md:flex md:ml-18 h-full max-h-screen w-60 z-20 flex-col inset-0">
      <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
        <ServerHeader server={server} role={role} />
        <ServerSearch server={server} />
        <Separator />
        <ScrollArea className="flex-1 p-3 max-w-full w-full">
          <ServerChannels server={server} role={role} />
          <ServerMembers server={server} role={role} profileId={profile.id} />
        </ScrollArea>
      </div>
    </section>
  )
}
