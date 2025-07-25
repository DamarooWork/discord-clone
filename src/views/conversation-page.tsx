import { prisma } from '@/shared/lib'

interface Props {
  serverId: string
  memberId: string
}
export async function ConversationPage({ serverId, memberId }: Props) {
  const member = await prisma.member.findUnique({
    where: {
      id: memberId,
    },
    include: {
      profile: true,
    },
  })
  return (
    <section>
      Welcome to conversation page with member # {member?.profile?.name}
    </section>
  )
}
