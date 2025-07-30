'use client'
import { cn } from '@/shared/lib/utils'
import { MessageWithMemberWithProfile } from '@/shared/types'
import { UserAvatar } from '../user-avatar'
import { RoleIcon, TooltipWidget } from '@/widgets'
import { Member, MemberRole } from '@prisma/client'
import { Link, useRouter } from '@/i18n/navigation'
import Image from 'next/image'
import { Pencil, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EditMessageForm } from '../forms'
import { ModalType, useModalStore } from '@/shared/store'

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
  const { onOpen } = useModalStore()
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()
  const isAdmin = currentMember.role === MemberRole.ADMIN
  const isModerator = currentMember.role === MemberRole.MODERATOR
  const isOwner = currentMember.id === message.member.id

  const canDeleteMessage =
    !message.deleted && (isAdmin || isOwner || isModerator)
  const canEditMessage = !message.deleted && isOwner && !message.fileUrl
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }
  useEffect(() => {
    addEventListener('keydown', handleKeyDown)
    return () => {
      removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  const onMemberClick = () => {
    if (message.member.id === currentMember.id) {
      return
    }
    router.push(
      `/servers/${message.member.serverId}/conversations/${message.member.id}`
    )
  }
  return (
    <div
      className={cn(
        'group min-h-8 w-full hover:bg-zinc-200 dark:hover:bg-zinc-700 p-2 flex gap-4 items-start px-4 transition-colors relative mt-3',
        className
      )}
    >
      <div
        onClick={onMemberClick}
        className="cursor-pointer hover:drop-shadow-md transition"
      >
        {message.member.profile.imageUrl && (
          <UserAvatar imageUrl={message.member.profile.imageUrl} />
        )}
      </div>
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-2">
          <div
            onClick={onMemberClick}
            className={cn(
              'font-semibold',
              message.member.id !== currentMember.id &&
                ' hover:underline cursor-pointer'
            )}
          >
            {message.member.profile.name}
          </div>
          <RoleIcon role={message.member.role} />
          <span className="text-zinc-500 dark:text-zinc-400">
            {messageDate}
          </span>
        </div>
        {isEditing ? (
          <EditMessageForm
            setIsEditing={setIsEditing}
            socketUrl={socketUrl}
            socketQuery={socketQuery}
            message={message}
            type={'channel'}
          />
        ) : (
          !message.fileType && (
            <div className="flex gap-1 items-center">
              <p
                className={cn(
                  message.deleted &&
                    'italic text-sm text-zinc-500 dark:text-zinc-400 pt-1'
                )}
              >
                {message.content}
              </p>
              {message.createdAt !== message.updatedAt && !message.deleted && (
                <span className="text-zinc-500 dark:text-zinc-400 text-sm">
                  (изменено)
                </span>
              )}
            </div>
          )
        )}
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
              <Pencil
                onClick={() => setIsEditing(!isEditing)}
                className="size-5 min-w-5 min-h-5 cursor-pointer text-zinc-600 dark:text-zinc-300 hover:text-zinc-700 dark:hover:text-zinc-200 ml-1"
              />
            </TooltipWidget>
          )}
          {canDeleteMessage && (
            <TooltipWidget label="Delete message">
              <X
                onClick={() =>
                  onOpen(ModalType.DELETE_MESSAGE, {
                    query: socketQuery,
                    apiUrl: `${socketUrl}/${message.id}`,
                    messageFileUrl: message.fileUrl ?? '',
                  })
                }
                className={cn(
                  'size-8 min-w-8 min-h-8  cursor-pointer text-rose-500'
                )}
              />
            </TooltipWidget>
          )}
        </div>
      )}
    </div>
  )
}
