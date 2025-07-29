'use client'
import { cn } from '@/shared/lib/utils'
import { MessageWithMemberWithProfile } from '@/shared/types'
import { UserAvatar } from '../user-avatar'
import { RoleIcon, TooltipWidget } from '@/widgets'
import { Member, MemberRole } from '@prisma/client'
import { Link, useRouter } from '@/i18n/navigation'
import Image from 'next/image'
import { Pencil, X } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import { useState } from 'react'
import { actionDeleteUploadThingFile } from '@/shared/lib/actions'

interface Props {
  message: MessageWithMemberWithProfile
  className?: string
  socketUrl: string
  socketQuery: Record<string, string>
  currentMember: Member
  messageDate: string
}
export function ChatItem({
  className,
  message,
  socketUrl,
  socketQuery,
  currentMember,
  messageDate,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()
  const isAdmin = currentMember.role === MemberRole.ADMIN
  const isModerator = currentMember.role === MemberRole.MODERATOR
  const isOwner = currentMember.id === message.member.id

  const canDeleteMessage =
    !message.deleted && (isAdmin || isOwner || isModerator)
  const canEditMessage = !message.deleted && isOwner && !message.fileUrl

  const handleDeleteMessage = async () => {
    try {
      setIsDeleting(true)
      await axios.delete('/api/messages', {
        data: {
          messageId: message.id,
        },
      })
      // if (message.fileUrl) {
      //   await actionDeleteUploadThingFile(message.fileUrl)
      // }
      router.refresh()
      toast.success('Message deleted!')
    } catch (e) {
      console.log(e)
      toast.error('Something went wrong!')
    } finally {
      setIsDeleting(false)
    }
  }
  return (
    <div
      className={cn(
        'group min-h-8 w-full hover:bg-zinc-200 dark:hover:bg-zinc-700 p-2 flex gap-4 items-start px-4 transition-colors relative mt-3',
        className
      )}
    >
      <div className="cursor-pointer hover:drop-shadow-md transition">
        {message.member.profile.imageUrl && (
          <UserAvatar imageUrl={message.member.profile.imageUrl} />
        )}
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <p className="font-semibold hover:underline cursor-pointer">
            {message.member.profile.name}
          </p>
          <RoleIcon role={message.member.role} />
          <span className="text-zinc-500 dark:text-zinc-400">
            {messageDate}
          </span>
          {message.createdAt !== message.updatedAt && (
            <span className="text-zinc-500 dark:text-zinc-400 text-sm">
              (изменено)
            </span>
          )}
        </div>
        {!message.fileType && <p className=" ">{message.content}</p>}
        {message.fileType === 'PDF' && message.fileUrl && (
          <Link
            href={message.fileUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            {message.fileName}
          </Link>
        )}
        {message.fileType === 'IMAGE' && message.fileUrl && (
          <Image
            src={message.fileUrl}
            alt="Uploaded image"
            className="mt-2  rounded-sm"
            width={200}
            height={200}
          />
        )}
      </div>
      {(canEditMessage || canDeleteMessage) && (
        <div className="group-hover:opacity-100 opacity-0 transition absolute -top-4 right-2 flex gap-1 items-center bg-zinc-200 dark:bg-zinc-700 px-1 rounded-md z-10 border  ">
          {canEditMessage && (
            <TooltipWidget label="Edit message">
              <Pencil className="size-5 min-w-5 min-h-5 cursor-pointer text-zinc-600 dark:text-zinc-300 hover:text-zinc-700 dark:hover:text-zinc-200 ml-1" />
            </TooltipWidget>
          )}
          {canDeleteMessage && (
            <TooltipWidget label="Delete message">
              <X
                onClick={handleDeleteMessage}
                className={cn(
                  'size-8 min-w-8 min-h-8  cursor-pointer text-rose-500',
                  isDeleting && 'text-zinc-300 dark:text-zinc-500'
                )}
              />
            </TooltipWidget>
          )}
        </div>
      )}
    </div>
  )
}
