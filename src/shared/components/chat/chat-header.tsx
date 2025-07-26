import { ChatType } from '@/shared/types'
import { MobileToogle } from '@/widgets'
import { Hash } from 'lucide-react'
import { UserAvatar } from '../user-avatar'
import { NavigationSidebar } from '../navigation'
import { ServerSidebar } from '../server'

interface ChatHeaderProps {
  serverId: string
  name: string
  type: ChatType
  imageUrl?: string
  profileId: string
}
export function ChatHeader({
  serverId,
  name,
  type,
  imageUrl,
  profileId,
}: ChatHeaderProps) {
  return (
    <header className="text-md font-semibold px-3 flex gap-2 items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToogle>
        <>
          <NavigationSidebar profileId={profileId} />
          <ServerSidebar serverId={serverId} profileId={profileId} sheet />
        </>
      </MobileToogle>
      {type === 'channel' && (
        <Hash className="size-5 min-w-5 min-h-5 text-zinc-500 dark:text-zinc-400" />
      )}
      {type === 'conversation' && <UserAvatar className='size-5 min-h-5 min-w-5 md:size-7 md:min-h-7 md:min-w-7' imageUrl={imageUrl} />}
      <p className="font-semibold ">{name}</p>
    </header>
  )
}
