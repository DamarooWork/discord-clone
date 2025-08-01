import { redirect } from '@/i18n/navigation'
import { ChatHeader, ChatInput, ChatMessages } from '@/shared/components/chat'
import { MediaRoom } from '@/shared/components/media'
import { currentProfile, prisma } from '@/shared/lib'
import { RedirectToSignIn } from '@clerk/nextjs'
import { ChannelType } from '@prisma/client'
import { getLocale } from 'next-intl/server'

interface ChannelPageProps {
  serverId: string
  channelId: string
}
export async function ChannelPage({ serverId, channelId }: ChannelPageProps) {
  const profile = await currentProfile()
  if (!profile) {
    return <RedirectToSignIn />
  }
  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId,
      serverId,
    },
    include: {
      profile: true,
    },
  })

  const member = await prisma.member.findFirst({
    where: {
      profileId: profile.id,
      serverId,
    },
    include: {
      profile: true,
    },
  })
  if (!channel || !member) {
    return redirect({
      href: `/`,
      locale: await getLocale(),
    })
  }
  return (
    <section className=" h-screen flex flex-col">
      <ChatHeader
        profileId={profile.id}
        serverId={serverId}
        name={channel.name}
        type="channel"
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            name={channel.name}
            type={'channel'}
            member={member}
            chatId={channel.id}
            apiUrl={`/api/messages`}
            socketUrl={`/api/socket/messages`}
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey={'channelId'}
            paramValue={channel.id}
          />
          <ChatInput
            name={channel.name}
            type={'channel'}
            apiUrl={`/api/socket/messages`}
            query={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
          />
        </>
      )}
      {channel.type === ChannelType.VOICE && (
        <MediaRoom chatId={channel.id} video={false} audio />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channel.id} video audio />
      )}
    </section>
  )
}
