'use client'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui'
import { useModalStore, ModalType } from '@/shared/store'
import axios from 'axios'
import { toast } from 'sonner'
import { actionDeleteUploadThingFile } from '@/shared/lib/actions'
import { useState } from 'react'
import qs from 'query-string'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function DeleteMessageModal() {
  const g = useTranslations('general')
  const [isLoading, setIsLoading] = useState(false)
  const { isOpen, onClose, type, data } = useModalStore()
  const { query, apiUrl, messageFileUrl } = data
  const isModalOpen = isOpen && type === ModalType.DELETE_MESSAGE
  const handleDeleteMessage = async () => {
    try {
      setIsLoading(true)
      const url = qs.stringifyUrl({
        url: apiUrl as string,
        query,
      })
      await axios.delete(url)
      if (messageFileUrl) {
        await actionDeleteUploadThingFile(messageFileUrl)
      }
      toast.success('Message deleted!')
      onClose()
    } catch (e) {
      console.log(e)
      toast.error(g('error_message'))
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="p-0 overflow-hidden px-6"
      >
        <DialogHeader className="pt-8 ">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-foreground text-md">
            Are you sure you want to do this?
            <br />
            The message will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mb-4">
          <Button
            variant="destructive"
            onClick={handleDeleteMessage}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="size-6 mx-1  animate-spin" /> : g('delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
