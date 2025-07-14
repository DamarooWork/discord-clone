import { NavigationSidebar } from '@/shared/components/navigation'

interface Props {
  children: React.ReactNode
}
export default async function MainLayout({ children }: Props) {
  return (
    <>
      <NavigationSidebar />
      <main className="md:pl-18 min-h-screen">{children}</main>
    </>
  )
}
