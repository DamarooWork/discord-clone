'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from '@/shared/ui'
import { useModalStore, ModalType } from '@/shared/store'
import { useOrigin } from '@/shared/hooks'
import { toast } from 'sonner'
import axios from 'axios'
import { cn } from '@/shared/lib/utils'

export function CreateChannelModal() {
  const { onOpen, isOpen, onClose, type, data } = useModalStore()
  const origin = useOrigin()
  const isModalOpen = isOpen && type === ModalType.CREATE_CHANNEL

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="bg-foreground text-background p-0 overflow-hidden"
      >
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Create a new channel
          </DialogTitle>
          <DialogDescription className="text-center text-primary-foreground text-md">
            Here you can create a text, voice or video channel
          </DialogDescription>
        </DialogHeader>
        <div className="m-4  flex flex-col items-start gap-2">
          <Label className="uppercase text-xs font-bold text-primary-foreground dark:text-secondary/70">
            Create text chat:
          </Label>
          <Label className="uppercase text-xs font-bold text-primary-foreground dark:text-secondary/70">
            Create voice chat:
          </Label>
          <Label className="uppercase text-xs font-bold text-primary-foreground dark:text-secondary/70">
            Create video chat:
          </Label>
        </div>
      </DialogContent>
    </Dialog>
  )
}
