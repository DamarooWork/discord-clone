import { ChatType } from '@/shared/types'
import { MobileToogle, RoleIcon, SocketIndicator } from '@/widgets'
import { Hash } from 'lucide-react'
import { UserAvatar } from '../user-avatar'
import { NavigationSidebar } from '../navigation'
import { ServerSidebar } from '../server'
import { MemberRole } from '@prisma/client'

interface ChatHeaderProps {
  serverId: string
  name: string
  type: ChatType
  imageUrl?: string
  profileId: string
  role?: MemberRole
}
export function ChatHeader({
  serverId,
  name,
  type,
  imageUrl,
  profileId,
  role,
}: ChatHeaderProps) {
  return (
    <header className="text-md font-semibold px-3 flex gap-2 items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 rounded-b-md shadow-xl">
      <MobileToogle>
        <div className="flex">
          <NavigationSidebar profileId={profileId} />
          <ServerSidebar serverId={serverId} profileId={profileId} sheet />
        </div>
      </MobileToogle>
      {type === 'channel' && (
        <Hash className="size-5 min-w-5 min-h-5 text-zinc-500 dark:text-zinc-400" />
      )}
      {type === 'conversation' && (
        <UserAvatar
          className="size-8 min-h-8 min-w-8 md:size-8 md:min-h-8 md:min-w-8"
          imageUrl={imageUrl}
        />
      )}
      <p className="font-semibold ">{name}</p>
      {role && <RoleIcon role={role} />}
      <SocketIndicator className="ml-auto" />
    </header>
  )
}
