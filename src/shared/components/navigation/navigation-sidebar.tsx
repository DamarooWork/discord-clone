import { redirect } from '@/i18n/navigation'
import { currentProfile, prisma } from '@/shared/lib'
import { getLocale } from 'next-intl/server'
import { NavigationAction, ServersList } from '@/shared/components/navigation'
import { AuthButton, LanguageSelector, ThemeSelector } from '@/widgets'
import { Separator } from '@/shared/ui'


interface Props {
  className?: string
}
export async function NavigationSidebar({ className }: Props) {
  const profile = await currentProfile()

  if (!profile) {
    const locale = await getLocale()
    return redirect({ href: '/', locale })
  }

  const servers = await prisma.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  return (
    <aside className="hidden md:flex w-[72px] flex-col z-30 fixed inset-y-0 overflow-hidden h-full">
      <div className="gap-3 py-3 flex flex-col justify-between items-center text-primary dark:bg-[#1E1F22]  h-full w-full">
        <NavigationAction />
        <Separator className="data-[orientation=horizontal]:w-12 mx-auto data-[orientation=horizontal]:h-[2px] rounded-md" />
        <ServersList servers={servers} />
        <LanguageSelector />
        <ThemeSelector />
        <AuthButton/>
      </div>
    </aside>
  )
}
