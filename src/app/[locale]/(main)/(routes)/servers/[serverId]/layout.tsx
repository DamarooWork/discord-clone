import { redirect } from '@/i18n/navigation'
import { ServerSidebar } from '@/shared/components/server'
import { currentProfile, prisma } from '@/shared/lib'
import { RedirectToSignIn } from '@clerk/nextjs'
import { getLocale } from 'next-intl/server'


interface Props {
  children: React.ReactNode
  params: Promise<{ serverId: string }>
}
export default async function ServerLayout({ children, params }: Props) {
  const profile = await currentProfile()
  if (!profile) {
    return <RedirectToSignIn />
  }
  const { serverId } = await params
  const server = await prisma.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
   
  })
  if (!server) {
    return redirect({ href: '/', locale: await getLocale() })
  }
  return (
    <>
      <ServerSidebar serverId={server.id} />
      <section className="h-full md:pl-60">{children}</section>
    </>
  )
}
