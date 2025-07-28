'use client'
import { cn } from '@/shared/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui'
import { Smile } from 'lucide-react'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { useTheme } from 'next-themes'

interface Props {
  className?: string
  onChange: (value: string) => void
}
export function EmojiPicker({ className, onChange }: Props) {
  const { resolvedTheme } = useTheme()
  return (
    <section className={className}>
      <Popover>
        <PopoverTrigger>
          <Smile className="cursor-pointer text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
        </PopoverTrigger>
        <PopoverContent
          side="right"
          sideOffset={40}
          className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
        >
          <Picker
            theme={resolvedTheme}
            data={data}
            onEmojiSelect={(emoji: any) => onChange(emoji.native)}
          />
        </PopoverContent>
      </Popover>
    </section>
  )
}
