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
import { useTranslations } from 'next-intl'

export function CreateChannelModal() {
  const { isOpen, onClose, type, data } = useModalStore()
  const isModalOpen = isOpen && type === ModalType.CREATE_CHANNEL
const t = useTranslations('create_channel_modal')
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="p-0 overflow-hidden"
      >
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
          {t('title')}
          </DialogTitle>
          <DialogDescription className="text-center text-foreground text-md">
             {t('description')}
          </DialogDescription >
        </DialogHeader>
        {data.server && <CreateChannelForm server={data.server} channelType={data.channelType} />}
      </DialogContent>
    </Dialog>
  )
}
