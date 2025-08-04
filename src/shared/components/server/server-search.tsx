'use client'
import { useRouter } from '@/i18n/navigation'
import {
  SectionType,
  ServerWithMembersWithProfilesAndChannelsWithProfiles,
} from '@/shared/types'
import {
  CommandDialog,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/shared/ui'
import { ChannelIcon, RoleIcon } from '@/widgets'
import { ChannelType } from '@prisma/client'
import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ServerSearchProps {
  server: ServerWithMembersWithProfilesAndChannelsWithProfiles
}
export function ServerSearch({ server }: ServerSearchProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const params = useParams()
  const t = useTranslations('server')
  const g = useTranslations('general')
  const channelsData = Object.values(ChannelType).map((type) => ({
    label: g(`${type.toLowerCase()}_channels`) + ` ${t('channels')}`,
    type: 'channels' as SectionType,
    data: server.channels
      .filter((channel) => channel.type === type)
      .map((channel) => ({
        icon: <ChannelIcon type={channel.type} />,
        name: channel.name,
        id: channel.id,
      })),
  }))

  const membersData = {
    label: t('members'),
    type: 'members' as SectionType,
    data: server.members.map((member) => ({
      icon: <RoleIcon role={member.role} />,
      name: member.profile.name,
      id: member.profile.id,
    })),
  }
  const data = [...channelsData, membersData]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' || 'K'|| 'л' || 'Л') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    addEventListener('keydown', handleKeyDown)
    return () => removeEventListener('keydown', handleKeyDown)
  }, [])
  const handleCommandSelect = (id: string, type: SectionType) => {
    setOpen(false)

    if (type === 'channels') {
      router.push(`/servers/${params?.serverId}/channels/${id}`)
    }
    if (type === 'members') {
      router.push(`/servers/${params?.serverId}/conversations/${id}`)
    }
  }
  return (
    <section className="p-3">
      <button
        onClick={() => setOpen((open) => !open)}
        className="group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-main active:bg-main/80 transition ease-in-out cursor-pointer text-zinc-700 dark:text-zinc-400 "
      >
        <Search className="size-4 min-w-4 min-h-4 group-hover:text-zinc-200 dark:group-hover:text-zinc-300 transition ease-in-out group-hover:motion-preset-pulse        " />
        <span className="group-hover:text-zinc-200 dark:group-hover:text-zinc-300 transition ease-in-out font-semibold">
          {t('search')}
        </span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-x-1 rounded border border-zinc-200 bg-zinc-50 px-2 text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 ml-auto">
          <span>ctrl</span>+<span>K</span>
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search all channels and members" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {data.map(({ label, type, data }, i) => {
            if (!data?.length) return null
            return (
              <CommandGroup key={label} heading={label}>
                {data.map(({ icon, name, id }) => (
                  <CommandItem
                    key={id}
                    onSelect={() => handleCommandSelect(id, type)}
                  >
                    {icon}
                    {name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )
          })}
        </CommandList>
      </CommandDialog>
    </section>
  )
}
