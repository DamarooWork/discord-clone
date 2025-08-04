'use client'
import { useRouter } from '@/i18n/navigation'
import { cn } from '@/shared/lib/utils'
import { ModalType, useModalStore } from '@/shared/store'
import { ServerWithMembersWithProfilesAndChannelsWithProfiles } from '@/shared/types'
import { ChannelIcon, TooltipWidget } from '@/widgets'
import { useTracks } from '@livekit/components-react'
import { Channel, MemberRole } from '@prisma/client'
import { Track } from 'livekit-client'
import { Edit, Lock, Trash } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

interface ServerChannelProps {
  channel: Channel
  server: ServerWithMembersWithProfilesAndChannelsWithProfiles
  role?: MemberRole
}
export function ServerChannel({ channel, server, role }: ServerChannelProps) {
  const { onOpen } = useModalStore()

  const params = useParams()
  const router = useRouter()
  const g = useTranslations('general')
  const t = useTranslations('server')
  const handleChannelClick = () => {
    router.push(`/servers/${channel.serverId}/channels/${channel.id}`)
  }
  const handleEditChannel = (e: React.MouseEvent<SVGElement>) => {
    e.stopPropagation()
    onOpen(ModalType.EDIT_CHANNEL, { server, channel })
  }
  const handleDeleteChannel = (e: React.MouseEvent<SVGElement>) => {
    e.stopPropagation()
    onOpen(ModalType.DELETE_CHANNEL, { channel })
  }

  return (
    <button
      onClick={handleChannelClick}
      className={cn(
        'flex gap-2 items-center group p-2 rounded-md  hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-all ease-in-out cursor-pointer',
        params?.channelId === channel.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      <ChannelIcon
        className="group-hover:motion-preset-seesaw"
        type={channel.type}
      />
      <p
        className={cn(
          'line-clamp-1 max-w-31 text-ellipsis  font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition-all ease-in-out text-start',
          params?.channelId === channel.id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {channel.name}
      </p>
      <div className="flex gap-1.5 items-center ml-auto">
        {channel.name !== 'General' && role !== MemberRole.GUEST && (
          <TooltipWidget label={g('edit')}>
            <Edit
              onClick={handleEditChannel}
              className="size-4 min-w-4 min-h-4 text-foreground cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-300"
            />
          </TooltipWidget>
        )}
        {channel.name !== 'General' && role !== MemberRole.GUEST && (
          <TooltipWidget label={g('delete')}>
            <Trash
              onClick={handleDeleteChannel}
              className="size-4 min-w-4 min-h-4 text-foreground cursor-pointer  opacity-0  group-hover:opacity-100  transition-opacity ease-in-out duration-300"
            />
          </TooltipWidget>
        )}
        {channel.name === 'General' && (
          <TooltipWidget label={t('general_channel')}>
            <Lock className="size-4 min-w-4 min-h-4 text-foreground cursor-default opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-300" />
          </TooltipWidget>
        )}
      </div>
    </button>
  )
}
