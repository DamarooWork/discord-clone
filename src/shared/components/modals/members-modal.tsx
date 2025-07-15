'use client'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Label,
  ScrollArea,
} from '@/shared/ui'
import { useModalStore, ModalType } from '@/shared/store'
import { useState } from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import { ShieldAlert, ShieldCheck, UserMinus } from 'lucide-react'
import { UserAvatar } from '@/shared/components'
import { Member, MemberRole } from '@prisma/client'

const roleIconMap = {
  [MemberRole.ADMIN]: (
    <ShieldAlert className="size-4 min-w-4 min-h-4 text-rose-500" />
  ),
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="size-4 min-w-4 min-h-4 ml-2 text-main" />
  ),
  [MemberRole.GUEST]: null,
}

export function MembersModal() {
  const { onOpen, isOpen, onClose, type, data } = useModalStore()
  const [loadingId, setLoadingId] = useState<string>('')

  const isModalOpen = isOpen && type === ModalType.MEMBERS
  const { server } = data
  const handleUpdateRole = async (member: Member) => {
    setLoadingId(member.id)
    try {
      await axios.patch(`/api/servers/${server?.id}/members/${member.id}`, {
        role: MemberRole.GUEST,
      })
      toast.success('Member role updated!')
    } catch (e) {
      toast.error('Something went wrong!')
      console.log(e)
    } finally {
      setLoadingId('')
    }
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-foreground text-background p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-primary-foreground text-md">
            {server?.members.length} Members
          </DialogDescription>
        </DialogHeader>
        <div className="m-4  flex flex-col items-start gap-2">
          <Label className="uppercase text-xs font-bold text-primary-foreground dark:text-secondary/70">
            MEMBERS:
          </Label>
          <ScrollArea className="w-full max-h-80 ">
            <ul className="flex flex-col gap-2">
              {server?.members.map((member) => (
                <li
                  className="flex items-center justify-between "
                  key={member.id}
                >
                  <div className="flex gap-2 items-center font-semibold">
                    <UserAvatar imageUrl={member.profile.imageUrl} />
                    {member.profile.name}
                    {roleIconMap[member.role]}
                  </div>
                  {server.profileId !== member.profileId &&
                    loadingId !== member.id && (
                      <div className="flex gap-2 items-center">
                        <Button
                          onClick={() => handleUpdateRole(member)}
                          className=""
                        >
                          {loadingId === member.id
                            ? 'Loading...'
                            : 'Update Role'}
                        </Button>
                        <Button
                          variant={'destructive'}
                          onClick={async () => {
                            try {
                              await axios.delete(
                                `/api/servers/${server?.id}/members/${member.id}`
                              )
                              toast.success('Member removed!')
                            } catch (e) {
                              toast.error('Something went wrong!')
                              console.log(e)
                            }
                          }}
                        >
                          <UserMinus className="size-4 min-w-4 min-h-4" />
                        </Button>
                      </div>
                    )}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
