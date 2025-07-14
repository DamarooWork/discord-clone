import { redirect } from '@/i18n/navigation'
import { currentProfile, prisma } from '@/shared/lib'
import { RedirectToSignIn } from '@clerk/nextjs'
import { getLocale } from 'next-intl/server'
// import { toast } from 'sonner'

interface InviteCodePageProps {
  inviteCode: string
}
export async function InviteCodePage({ inviteCode }: InviteCodePageProps) {
  const profile = await currentProfile()
  if (!profile) {
    return <RedirectToSignIn />
  }
  if (!inviteCode) {
    const locale = await getLocale()
    return redirect({ href: '/', locale })
  }
  const server = await prisma.server.findFirst({
    where: {
      inviteCode,
    },
    include: {
      members: true,
    },
  })
  if (!server) {
    const locale = await getLocale()
    return redirect({ href: '/', locale })
  }
  if (!server.members.some((m) => m.profileId === profile.id)) {
    await prisma.member.create({
      data: {
        profileId: profile.id,
        serverId: server.id,
      },
    })
  }
  const locale = await getLocale()
  return redirect({ href: '/servers/' + server.id, locale })
}
