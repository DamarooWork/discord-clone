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
        <DialogHeader className="pt-8 sm:px-6 sm:text-center px-3 max-w-[calc(100vw-2rem)] ">
          <DialogTitle className="text-2xl  font-bold">
            {t('title')}
          </DialogTitle>
          <DialogDescription className=" text-foreground text-md">
            {t('description')}
          </DialogDescription>
          <CreateServerForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
