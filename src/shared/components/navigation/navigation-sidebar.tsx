import { prisma } from '@/shared/lib'
import { NavigationAction, ServersList } from '@/shared/components/navigation'
import { AuthButton, LanguageSelector, ThemeSelector } from '@/widgets'
import { Separator } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
interface Props {
  profileId: string
  className?: string
}
export async function NavigationSidebar({ profileId , className }: Props) {
 
  const servers = await prisma.server.findMany({
    where: {
      members: {
        some: {
          profileId,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return (
    <aside className={cn(" w-18 flex-col z-30 fixed inset-y-0 overflow-hidden h-full border-r", className)}>
      <div className="gap-3 py-3 flex flex-col justify-between items-center text-primary dark:bg-[#1E1F22]  h-full w-full">
        <NavigationAction />
        <Separator className="data-[orientation=horizontal]:w-12 mx-auto data-[orientation=horizontal]:h-[2px] rounded-md" />
        <ServersList servers={servers} />
        <LanguageSelector />
        <ThemeSelector />
        <AuthButton />
      </div>
    </aside>
  )
}
