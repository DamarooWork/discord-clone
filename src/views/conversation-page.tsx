import { redirect } from '@/i18n/navigation'
import { ChatHeader, ChatInput, ChatMessages } from '@/shared/components/chat'
import { MediaRoom } from '@/shared/components/media'
import { currentProfile, getOrCreateConversation, prisma } from '@/shared/lib'
import { RedirectToSignIn } from '@clerk/nextjs'
import { getLocale } from 'next-intl/server'

interface Props {
  serverId: string
  memberId: string
  video?: boolean
}
export async function ConversationPage({
  serverId,
  memberId,
  video
}: Props) {
  const profile = await currentProfile()
  if (!profile) {
    return <RedirectToSignIn />
  }
  const currentMember = await prisma.member.findFirst({
    where: {
      profileId: profile.id,
      serverId,
    },
    include: {
      profile: true,
    },
  })
  if (!currentMember || currentMember.id === memberId) {
    return redirect({
      href: `/`,
      locale: await getLocale(),
    })
  }
  const conversation = await getOrCreateConversation(currentMember.id, memberId)
  if (!conversation) {
    return redirect({
      href: `/servers/${serverId}`,
      locale: await getLocale(),
    })
  }

  const { memberOne, memberTwo } = conversation!
  const otherMember = memberOne.id === currentMember.id ? memberTwo : memberOne

  return (
    <section className=" h-screen flex flex-col">
      <ChatHeader
        profileId={profile.id}
        serverId={serverId}
        name={otherMember.profile.name}
        type="conversation"
        imageUrl={otherMember.profile.imageUrl}
        role={otherMember.role}
      />

      {video ? (
        <MediaRoom chatId={conversation.id} video audio />
      ) : (
        <>
          <ChatMessages
            name={otherMember.profile.name}
            type={'conversation'}
            member={currentMember}
            chatId={conversation.id}
            apiUrl={`/api/direct-messages`}
            socketUrl={`/api/socket/direct-messages`}
            socketQuery={{
              conversationId: conversation.id,
            }}
            paramKey={'conversationId'}
            paramValue={conversation.id}
          />
          <ChatInput
            name={otherMember.profile.name}
            type={'conversation'}
            apiUrl={`/api/socket/direct-messages`}
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </section>
  )
}
