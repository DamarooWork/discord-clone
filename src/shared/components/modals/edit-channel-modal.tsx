'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui'
import { useModalStore, ModalType } from '@/shared/store'
import { EditChannelForm } from '@/shared/components/forms'

export function EditChannelModal() {
  const { isOpen, onClose, type, data } = useModalStore()
  const isModalOpen = isOpen && type === ModalType.EDIT_CHANNEL

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="p-0 overflow-hidden"
      >
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Edit Channel
          </DialogTitle>
          <DialogDescription className="text-center text-foreground text-md">
            Here you can edit your{' '}
            <span className="font-semibold">
              #{data?.channel?.type.toLowerCase()}
            </span>{' '}
            channel
          </DialogDescription>
        </DialogHeader>
        {data?.channel && data?.server && (
          <EditChannelForm server={data.server} channel={data.channel} />
        )}
      </DialogContent>
    </Dialog>
  )
}
