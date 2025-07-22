'use client'
import { useRouter } from '@/i18n/navigation'
import { SectionType } from '@/shared/types'
import {
  CommandDialog,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/shared/ui'
import { Search } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ServerSearchProps {
  data: {
    label: string
    type: SectionType
    data: { icon: React.ReactNode; name: string; id: string }[] | undefined
  }[]
}
export function ServerSearch({ data,  }: ServerSearchProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const params = useParams()
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
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
      router.push(`/servers/${params.serverId}/channels/${id}`)
    }
    if (type === 'members') {
      router.push(`/servers/${params.serverId}/conversations/${id}`)
    }
  }
  return (
    <section className='p-3'>
      <button
        onClick={() => setOpen((open) => !open)}
        className="group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-main active:bg-main/80 transition ease-in-out cursor-pointer text-zinc-700 dark:text-zinc-400 "
      >
        <Search className="size-4 min-w-4 min-h-4 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition ease-in-out" />
        <span className="group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition ease-in-out font-semibold">
          Search
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
                  <CommandItem key={id} onSelect={() => handleCommandSelect(id, type)}>
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
