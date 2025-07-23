import { redirect } from '@/i18n/navigation'
import { currentProfile, prisma } from '@/shared/lib'
import { ChannelType } from '@prisma/client'
import { getLocale } from 'next-intl/server'
import { ServerHeader } from './server-header'
import { ScrollArea, Separator } from '@/shared/ui'
import { ServerSearch } from './server-search'
import { ChannelIcon, RoleIcon } from '@/widgets'
import { SectionType } from '@/shared/types'
import { ServerSection } from './server-section'
import { ServerChannel } from './server-channel'

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

  const channelsData = Object.values(ChannelType).map((type) => ({
    label: type + ' Channels',
    type: 'channels' as SectionType,
    data: server.channels
      .filter((channel) => channel.type === type)
      .map((channel) => ({
        icon: <ChannelIcon type={channel.type} />,
        name: channel.name,
        id: channel.id,
      })),
  }))

  const membersData = {
    label: 'Members',
    type: 'members' as SectionType,
    data: server.members.map((member) => ({
      icon: <RoleIcon role={member.role} />,
      name: member.profile.name,
      id: member.profile.id,
    })),
  }
  return (
    <section className="hidden fixed md:flex md:ml-18 h-full max-h-screen w-60 z-20 flex-col inset-0">
      <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
        <ServerHeader server={server} role={role} />
        <ServerSearch data={[...channelsData, membersData]} />
        <Separator />
        <ScrollArea className="flex-1 p-3 max-w-full w-full">
          {Object.values(ChannelType).map((type) => {
            if (
              server.channels.filter((channel) => channel.type === type)?.length
            ) {
              return (
                <section className="flex flex-col w-full max-w-full mb-4" key={type}>
                  <ServerSection
                    label={type + ' Channels'}
                    sectionType="channels"
                    channelType={type}
                    server={server}
                    role={role}
                  />
                  {server.channels
                    .filter((channel) => channel.type === type)
                    .map((channel) => (
                      <ServerChannel
                        key={channel.id}
                        channel={channel}
                        server={server}
                        role={role}
                      />
                    ))}
                </section>
              )
            }
          })}
          <ServerSection
            label="Members"
            sectionType="members"
            server={server}
            role={role}
          />
        </ScrollArea>
      </div>
    </section>
  )
}
