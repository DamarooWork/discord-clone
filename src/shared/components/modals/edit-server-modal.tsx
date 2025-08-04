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
import { useTranslations } from 'next-intl'

export function EditServerModal() {
  const t = useTranslations('edit_server_modal')
  const { isOpen, onClose, type, data } = useModalStore()
  const isModalOpen = isOpen && type === ModalType.EDIT_SERVER
  const { server } = data
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="p-0  overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            {t('title')}
          </DialogTitle>
          <DialogDescription className="text-center text-foreground text-md">
            {t('description')}
          </DialogDescription>
          <EditServerForm server={server} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
