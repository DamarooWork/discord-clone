'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui'
import { EditServerForm } from '@/shared/components/forms'
import { useModalStore, ModalType } from '@/shared/store'

export function EditServerModal() {
  const { isOpen, onClose, type, data } = useModalStore()
  const isModalOpen = isOpen && type === ModalType.EDIT_SERVER
  const { server } = data
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="p-0  overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Edit your server
          </DialogTitle>
          <DialogDescription className="text-center text-foreground text-md">
            Here you can edit your server name and avatar. You can always change
            it later.
          </DialogDescription>
          <EditServerForm server={server} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
