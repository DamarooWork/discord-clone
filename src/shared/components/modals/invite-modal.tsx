'use client'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from '@/shared/ui'
import { useModalStore, ModalType } from '@/shared/store'
import { useState } from 'react'
import { Check, Copy, RefreshCw } from 'lucide-react'
import { useOrigin } from '@/shared/hooks'
import { toast } from 'sonner'
import axios from 'axios'
import { cn } from '@/shared/lib/utils'

export function InviteModal() {
  const { onOpen, isOpen, onClose, type, data } = useModalStore()
  const origin = useOrigin()
  const [copied, setCopied] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const isModalOpen = isOpen && type === ModalType.INVITE
  const inviteLink = `${origin}/invite/${data.server?.inviteCode}`
  function handleClose() {
    onClose()
    setCopied(false)
  }
  function handleCopyText() {
    if (isLoading) return
    navigator.clipboard.writeText(inviteLink)
    if (!copied) {
      setCopied(true)
      toast.success('Copied!')
      setTimeout(() => {
        setCopied(false)
      }, 3000)
    }
  }
  const handleGenerateLink = async () => {
    try {
      setIsLoading(true)
      setCopied(false)
      const response = await axios.patch(
        `/api/servers/${data.server?.id}/invite-code`
      )
      onOpen(ModalType.INVITE, { server: response.data })
      toast.success('New link was generated!')
    } catch (e) {
      toast.error('Something went wrong!')
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent onOpenAutoFocus={(e)=>e.preventDefault()} className="bg-foreground text-background p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Here your invite link!
          </DialogTitle>
          <DialogDescription className="text-center text-primary-foreground text-md">
            You can invite people with this link!
          </DialogDescription>
        </DialogHeader>
        <div className="m-4  flex flex-col items-start gap-2">
          <Label className="uppercase text-xs font-bold text-primary-foreground dark:text-secondary/70">
            SERVER INVITE LINK
          </Label>
          <div className="relative w-full">
            <Input
              autoFocus={false}
              className="pr-8 truncate text-center border-main border-3"
              value={inviteLink}
              disabled={isLoading}
              readOnly
            />
            {copied ? (
              <Check
                className={cn(
                  'size-5 absolute top-1/2 right-2 -translate-y-1/2 text-green-600',
                  isLoading && 'opacity-50'
                )}
              />
            ) : (
              <Copy
                onClick={handleCopyText}
                className={cn(
                  'size-5 absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer  will-change-transform active:scale-90 transition-all ease-in-out',
                  isLoading && 'opacity-50'
                )}
              />
            )}
          </div>
          <Label className='uppercase text-xs font-bold text-primary-foreground dark:text-secondary/70'>
            New link
          </Label>
          <Button
            variant={'primary'}
            className=" text-xs p-0"
            onClick={handleGenerateLink}
            disabled={isLoading}
          >
            Generate a new link
            <RefreshCw className="size-4 min-w-4 min-h-4 " />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
