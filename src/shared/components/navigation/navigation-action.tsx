'use client'
import { ModalType, useModalStore } from '@/shared/store'
import { Button } from '@/shared/ui'
import { TooltipWidget } from '@/widgets'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function NavigationAction() {
  const { onOpen } = useModalStore()
  const t =  useTranslations('navigation')

  function handleClick() {
    onOpen(ModalType.CREATE_SERVER)
  }
  return (
    <TooltipWidget label={t('add_server')} side="right">
      <Button
        onClick={handleClick}
        className="group flex items-center justify-center cursor-pointer rounded-3xl dark:bg-foreground bg-foreground/70 size-12 hover:rounded-xl active:translate-y-0.5  hover:bg-main dark:hover:bg-main transition-all ease-in-out"
      >
        <Plus className="size-6 text-background" />
      </Button>
    </TooltipWidget>
  )
}
