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
import { DeleteServerForm } from '../forms/delete-server-form'
import axios from 'axios'
import { toast } from 'sonner'
import { actionRevalidatePath } from '@/shared/lib/actions'
import { useRouter } from '@/i18n/navigation'
import { useState } from 'react'
import { Channel } from 'diagnostics_channel'
import { ChannelType } from '@prisma/client'

export function DeleteChannelModal() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { isOpen, onClose, type, data } = useModalStore()
  const { channel } = data
  const isModalOpen = isOpen && type === ModalType.DELETE_CHANNEL
  const handleDeleteChannel = async () => {
    try {
      setIsLoading(true)
      await axios.delete(
        `/api/servers/${channel?.serverId}/channels/${channel?.id}`
      )
      toast.success(`The channel "${channel?.name}" was deleted!`)
      await actionRevalidatePath()
      onClose()
      router.push(`/servers/` + channel?.serverId)
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
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-center text-foreground text-md">
            Are you sure you want to delete{' '}
            <span className="font-bold text-main">#{channel?.name}</span>? 
            <br/>
            {channel?.type === ChannelType.TEXT && <span> All data from this channel will be permanently deleted.</span>}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mb-4">
          <Button
            variant="destructive"
            onClick={handleDeleteChannel}
            disabled={isLoading}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
