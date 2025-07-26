import { NavigationSidebar } from '@/shared/components/navigation'
import { currentProfile } from '@/shared/lib'
import { RedirectToSignIn } from '@clerk/nextjs'

interface Props {
  children: React.ReactNode
}
export default async function MainLayout({ children }: Props) {
  const profile = await currentProfile()
  if (!profile) {
    return <RedirectToSignIn />
  }
  return (
    <>
      <NavigationSidebar profileId={profile.id} className='hidden md:flex'  />
      <main className="md:pl-18 min-h-screen">{children}</main>
    </>
  )
}
