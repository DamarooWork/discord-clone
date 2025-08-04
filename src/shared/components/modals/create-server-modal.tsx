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
import { useTranslations } from 'next-intl'

export function CreateServerModal() {
  const t = useTranslations('create_server_modal')
  const { isOpen, onClose, type } = useModalStore()
  const isModalOpen = isOpen && type === ModalType.CREATE_SERVER

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
          <CreateServerForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
