'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui'
import { useModalStore, ModalType } from '@/shared/store'
import { CreateChannelForm } from '@/shared/components/forms'

export function CreateChannelModal() {
  const { isOpen, onClose, type, data } = useModalStore()
  const isModalOpen = isOpen && type === ModalType.CREATE_CHANNEL

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="p-0 overflow-hidden"
      >
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Create a new channel
          </DialogTitle>
          <DialogDescription className="text-center text-foreground text-md">
            Here you can create a text, voice or video channel
          </DialogDescription >
        </DialogHeader>
        {data.server && <CreateChannelForm server={data.server} channelType={data.channelType} />}
      </DialogContent>
    </Dialog>
  )
}
