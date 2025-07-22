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
import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { actionRevalidatePath } from '@/shared/lib/actions'

export function LeaveServerModal() {
  const { isOpen, onClose, type, data } = useModalStore()
  const isModalOpen = isOpen && type === ModalType.LEAVE_SERVER
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const handleLeaveServer = async () => {
    try {
      setIsLoading(true)
      await axios.patch(`/api/servers/${data.server?.id}/leave`)
      toast.success('You have successfully left the server!')
      onClose()
      await actionRevalidatePath()
      router.push(`/`)
    } catch (e) {
      toast.error('Something went wrong!')
      console.log(e)
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
          <DialogTitle className="text-2xl text-center font-bold ">
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center  text-md ">
            Are you sure you want to leave{' '}
            <span className="font-bold text-main">{data.server?.name}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row sm:flex-row justify-between sm:justify-between items-center mb-4">
          <Button  disabled={isLoading} variant="primary" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={isLoading} variant="destructive" onClick={handleLeaveServer}>
            Leave
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
