import { redirect } from '@/i18n/navigation'
import { currentProfile, prisma } from '@/shared/lib'
import { ChannelType } from '@prisma/client'
import { getLocale } from 'next-intl/server'
import { memo } from 'react'
import { ServerHeader } from './server-header'

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

  const textChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  )
  const voiceChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VOICE
  )
  const audioChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  )

  const members = server.members.filter(
    (member) => member.profileId !== profile.id
  )

  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role
  return (
    <section className="hidden fixed md:flex md:ml-18 h-full w-60 z-20 flex-col inset-0">
      <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
        <ServerHeader server={server} role={role} />
        <section className="p-3">
          {server.channels.map((server) => (
            <div key={server.id}>{server.name}</div>
          ))}
        </section>
      </div>
    </section>
  )
}
