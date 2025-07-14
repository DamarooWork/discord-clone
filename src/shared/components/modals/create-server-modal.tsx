'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui'
import { CreateServerForm } from '@/shared/components/forms'
import { useModalStore, ModalType } from '@/shared/store'

export function CreateServerModal() {
  const { isOpen, onClose, type } = useModalStore()
  const isModalOpen = isOpen && type === ModalType.CREATE_SERVER

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-foreground text-background p-0  overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-primary-foreground text-md">
            Give your server a personality with a custom name and avatar. You
            can always change it later.
          </DialogDescription>
          <CreateServerForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
