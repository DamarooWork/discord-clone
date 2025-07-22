'use client'
import { usePathname, useRouter } from '@/i18n/navigation'
import { cn } from '@/shared/lib/utils'
import { ChannelIcon } from '@/widgets'
import { Channel, MemberRole, Server } from '@prisma/client'

interface ServerChannelProps {
  channel: Channel
  server: Server
  role?: MemberRole
}
export function ServerChannel({ channel, server, role }: ServerChannelProps) {
  const params = usePathname()
  const router = useRouter()
  const handleClick = () => {
    console.log(channel)
  }
  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex gap-2 items-center group p-2 rounded-md w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-all ease-in-out cursor-pointer'
      )}
    >
      <ChannelIcon type={channel.type} />
      <p
        className={cn(
          'line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition-all ease-in-out'
        )}
      >
        {channel.name}
      </p>
    </button>
  )
}
