import { ServerSidebar } from '@/shared/components/server'
import { currentProfile } from '@/shared/lib'
import { RedirectToSignIn } from '@clerk/nextjs'

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
 

  return (
    <>
      <ServerSidebar serverId={serverId} profileId={profile.id} />
      <section className="h-full md:pl-60">{children}</section>
    </>
  )
}
