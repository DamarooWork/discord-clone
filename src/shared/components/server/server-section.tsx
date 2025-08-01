'use client'
import { ModalType, useModalStore } from '@/shared/store'
import {
  SectionType,
  ServerWithMembersWithProfilesAndChannelsWithProfiles,
} from '@/shared/types'
import { TooltipWidget } from '@/widgets'
import { ChannelType, MemberRole } from '@prisma/client'
import { Plus, Settings } from 'lucide-react'

interface ServerSectionProps {
  label: string
  role?: MemberRole
  sectionType: SectionType
  channelType?: ChannelType
  server?: ServerWithMembersWithProfilesAndChannelsWithProfiles
}
export function ServerSection({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) {
  const { onOpen } = useModalStore()
  return (
    <section className="flex justify-between items-center mb-2">
      <h3 className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </h3>
      {role !== MemberRole.GUEST && sectionType === 'channels' && (
        <TooltipWidget label="Create Channel" side="top">
          <button
            onClick={() =>
              onOpen(ModalType.CREATE_CHANNEL, { server, channelType })
            }
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-all ease-in-out cursor-pointer"
          >
            <span className="sr-only">Create Channel</span>
            <Plus className="size-4 min-w-4 min-h-4 " />
          </button>
        </TooltipWidget>
      )}
      {role === MemberRole.ADMIN && sectionType === 'members' && (
        <TooltipWidget label="Manage Members" side="top">
          <button
            onClick={() => onOpen(ModalType.MEMBERS, { server })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition-all ease-in-out cursor-pointer"
          >
            <span className="sr-only">Manage Members</span>
            <Settings className="size-4 min-w-4 min-h-4 hover:motion-rotate-in-180" />
          </button>
        </TooltipWidget>
      )}
    </section>
  )
}
