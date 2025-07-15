'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Label,
  ScrollArea,
} from '@/shared/ui'
import { useModalStore, ModalType } from '@/shared/store'
import { act, useState } from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import {
  Check,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  UserMinus,
} from 'lucide-react'
import { UserAvatar } from '@/shared/components'
import {  MemberRole } from '@prisma/client'
import { RoleIcon } from '@/widgets'



export function MembersModal() {
  const { onOpen,isOpen, onClose, type, data } = useModalStore()
  const [loadingId, setLoadingId] = useState<string>('')

  const isModalOpen = isOpen && type === ModalType.MEMBERS
  const { server } = data
  const handleUpdateRole = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId)
      const response= await axios.patch(`/api/servers/${server?.id}/members/${memberId}`, {
        role,
      })
      onOpen(ModalType.MEMBERS, { server: response.data })
      toast.success('Member role updated!')
    } catch (e) {
      toast.error('Something went wrong!')
      console.log(e)
    } finally {
      setLoadingId('')
    }
  }
  const handleDeleteMember = async (memberId: string) => {
    try {
      setLoadingId(memberId)
      const response = await axios.delete(`/api/servers/${server?.id}/members/${memberId}`)
      onOpen(ModalType.MEMBERS, { server: response.data })
      toast.success('Member is kicked!')
    } catch (e) {
      toast.error('Something went wrong!')
      console.log(e)
    } finally {
      setLoadingId('')
    }
  }
 
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent onOpenAutoFocus={(e)=>e.preventDefault()} className="bg-foreground text-background p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-primary-foreground text-md">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <div className="m-4  flex flex-col items-start gap-2">
          <Label className="uppercase text-xs font-bold text-primary-foreground dark:text-secondary/70">
            MEMBERS:
          </Label>
          <ScrollArea className="w-full max-h-80">
            <ul className="flex flex-col gap-2">
              {server?.members?.map((member) => (
                <li
                  className="flex items-center justify-between "
                  key={member.id}
                >
                  <div className="flex gap-2 items-center font-semibold">
                    <UserAvatar imageUrl={member?.profile?.imageUrl} />
                    {member.profile?.name}
                    <RoleIcon role={member?.role} />
                  </div>
                  {server.profileId !== member.profileId &&
                    loadingId !== member.id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className="size-4 min-w-4 min-h-4 cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="left">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center">
                              <ShieldQuestion className="size-4 min-w-4 min-h-4 mr-2" />
                              <span>Role</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUpdateRole(member.id, MemberRole.GUEST)
                                  }
                                  className="hover:bg-main"
                                >
                                  <Shield className="size-4 min-w-4 min-h-4 mr-2" />
                                  {MemberRole.GUEST}
                                  {member.role === MemberRole.GUEST && (
                                    <Check className="size-4 min-w-4 min-h-4 ml-2" />
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUpdateRole(
                                      member.id,
                                      MemberRole.MODERATOR
                                    )
                                  }
                                  className="hover:bg-main"
                                >
                                  <ShieldCheck className="size-4 min-w-4 min-h-4 mr-2" />
                                  {MemberRole.MODERATOR}
                                  {member.role === MemberRole.MODERATOR && (
                                    <Check className="size-4 min-w-4 min-h-4 ml-2" />
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteMember(member.id)}
                            variant="destructive"
                          >
                            <UserMinus className="size-4 min-w-4 min-h-4" />
                            Kick
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  {loadingId === member.id && (
                    <Loader2 className="size-4 min-w-4 min-h-4 animate-spin" />
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
