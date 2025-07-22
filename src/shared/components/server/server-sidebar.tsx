import { redirect } from '@/i18n/navigation'
import { currentProfile, prisma } from '@/shared/lib'
import { ChannelType } from '@prisma/client'
import { getLocale } from 'next-intl/server'
import { ServerHeader } from './server-header'
import { ScrollArea } from '@/shared/ui'
import { ServerSearch } from './server-search'
import { ChannelIcon, RoleIcon } from '@/widgets'
import { SearchVariants } from '@/shared/types'

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
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  })

  if (!server) {
    return redirect({ href: '/', locale: await getLocale() })
  }

  const members = server.members.filter(
    (member) => member.profileId !== profile.id
  )

  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role

  const channelData = Object.values(ChannelType).map((type) => ({
    label: type + ' Channels',
    type: 'channel' as SearchVariants,
    data: server.channels
      .filter((channel) => channel.type === type)
      .map((channel) => ({
        icon: <ChannelIcon type={channel.type} />,
        name: channel.name,
        id: channel.id,
      })),
  }))

  const memberData = {
    label: 'Members',
    type: 'member' as SearchVariants,
    data: members.map((member) => ({
      icon: <RoleIcon role={member.role} />,
      name: member.profile.name,
      id: member.profile.id,
    })),
  }
  return (
    <section className="hidden fixed md:flex md:ml-18 h-full w-60 z-20 flex-col inset-0">
      <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
        <ServerHeader server={server} role={role} />
        <ScrollArea className="flex-1 p-3">
          <ServerSearch data={[...channelData, memberData]} />
          {/* {server.channels.map((server) => (
            <div key={server.id}>{server.name}</div>
          ))} */}
        </ScrollArea>
      </div>
    </section>
  )
}
