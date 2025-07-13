'use client'
import { useModalStore } from '@/shared/store'
import { Button } from '@/shared/ui'
import { TooltipWidget } from '@/widgets'
import { Plus } from 'lucide-react'

export function NavigationAction() {
  const { onOpen } = useModalStore()
  return (
    <TooltipWidget label="Add a server" side="right">
      <Button onClick={() => onOpen('createServer')} className="group flex items-center justify-center cursor-pointer rounded-3xl bg-foreground size-12 hover:rounded-xl active:translate-y-0.5 hover:bg-main transition-all ease-in-out">
        <Plus className="size-6 text-background" />
      </Button>
    </TooltipWidget>
  )
}
