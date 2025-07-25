import { redirect } from '@/i18n/navigation'
import { currentProfile, prisma } from '@/shared/lib'
import { getLocale } from 'next-intl/server'
import { ScrollArea, Separator } from '@/shared/ui'
import {
  ServerChannels,
  ServerHeader,
  ServerMembers,
  ServerSearch,
} from '@/shared/components/server'
import { ServerWithMembersWithProfilesAndChannelsWithProfiles } from '@/shared/types'

interface ServerSidebarProps {
  server: ServerWithMembersWithProfilesAndChannelsWithProfiles
  profileId: string
}

export async function ServerSidebar({ server, profileId }: ServerSidebarProps) {
  const role = server.members.find(
    (member) => member.profileId === profileId
  )?.role
 
  return (
    <section className="hidden fixed md:flex md:ml-18 h-full max-h-screen w-60 z-20 flex-col inset-0">
      <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
        <ServerHeader server={server} role={role} />
        <ServerSearch server={server} />
        <Separator />
        <ScrollArea className="flex-1 p-3 max-w-full w-full">
          <ServerChannels server={server} role={role} />
          <ServerMembers server={server} role={role} profileId={profileId} />
        </ScrollArea>
      </div>
    </section>
  )
}
