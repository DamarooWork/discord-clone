'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui'
import { useModalStore, ModalType } from '@/shared/store'
import { DeleteServerForm } from '../forms/delete-server-form'

export function DeleteServerModal() {
  const { isOpen, onClose, type, data } = useModalStore()
  const isModalOpen = isOpen && type === ModalType.DELETE_SERVER

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="p-0 overflow-hidden px-6"
      >
        <DialogHeader className="pt-8 ">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Server
          </DialogTitle>
          <DialogDescription className="text-center text-foreground text-md">
            Are you sure you want to delete{' '}
            <span className="font-bold text-main">{data.server?.name}</span>?
            <br />
            Type{' '}
            <span className="font-bold text-main">{data.server?.name}</span> to
            confirm
          </DialogDescription>
        </DialogHeader>
        <DeleteServerForm server={data.server} />
      </DialogContent>
    </Dialog>
  )
}
