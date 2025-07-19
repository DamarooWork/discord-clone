'use client'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from '@/shared/ui'
import { useModalStore, ModalType } from '@/shared/store'
import { useState } from 'react'
import { Check, Copy, RefreshCw } from 'lucide-react'
import { useOrigin } from '@/shared/hooks'
import { toast } from 'sonner'
import axios from 'axios'
import { cn } from '@/shared/lib/utils'

export function DeleteServerModal() {
  const { onOpen, isOpen, onClose, type, data } = useModalStore()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const isModalOpen = isOpen && type === ModalType.DELETE_CHANNEL

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="bg-foreground text-background p-0 overflow-hidden"
      >
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Are you sure you want to delete this server?
          </DialogTitle>
          <DialogDescription className="text-center text-primary-foreground text-md">
            Type <span className="font-bold">{data.server?.name}</span> to
            confirm
          </DialogDescription>
        </DialogHeader>
        <div className="m-4 flex flex-col items-start gap-2">
          <Label className="uppercase text-xs font-bold text-primary-foreground dark:text-secondary/70">
            Type server name
          </Label>
          <div className="relative w-full">
            <Input
              autoFocus={false}
              className="border-main border-3"
              value={data.server?.name}
              disabled={isLoading}
            />
          </div>

          <Button className="mt-4" variant={'destructive'} disabled={isLoading}>
            Delete Server
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
