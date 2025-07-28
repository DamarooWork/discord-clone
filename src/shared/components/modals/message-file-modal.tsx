import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui'
import {  MessageFileForm } from '@/shared/components/forms'
import { ModalType, useModalStore } from '@/shared/store'

export function MessageFileModal() {
  const { onClose, isOpen, type } = useModalStore()

  const isModalOpen = type === ModalType.MESSAGE_FILE && isOpen
  
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="p-0  overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Add an attachment
          </DialogTitle>
          <DialogDescription className="text-center text-foreground text-md">
            Send a file as a message
          </DialogDescription>
          <MessageFileForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
