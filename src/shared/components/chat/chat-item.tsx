'use client'
import { cn } from '@/shared/lib/utils'
import { ChatType, MessageWithMemberWithProfile } from '@/shared/types'
import { UserAvatar } from '../user-avatar'
import { RoleIcon, TooltipWidget } from '@/widgets'
import { Member, MemberRole } from '@prisma/client'
import { Link, useRouter } from '@/i18n/navigation'
import Image from 'next/image'
import { Pencil, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EditMessageForm } from '../forms'
import { ModalType, useModalStore } from '@/shared/store'
import { useTranslations } from 'next-intl'

interface Props {
  message: MessageWithMemberWithProfile
  className?: string
  socketUrl: string
  socketQuery: Record<string, string>
  currentMember: Member
  messageDate: string
  type?: ChatType
}
export function ChatItem({
  className,
  message,
  socketUrl,
  socketQuery,
  currentMember,
  messageDate,
  type,
}: Props) {
  const { onOpen } = useModalStore()
  const t = useTranslations('chat')
  const g = useTranslations('general')
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()
  const isAdmin = currentMember?.role === MemberRole.ADMIN
  const isModerator = currentMember?.role === MemberRole.MODERATOR
  const isOwner = currentMember.id === message?.member?.id
  const anotherMemberMessageInConversation =
    type === 'conversation' && message.member.id !== currentMember.id
  const canDeleteMessage =
    !message.deleted &&
    (isAdmin || isOwner || isModerator) &&
    !anotherMemberMessageInConversation
  const canEditMessage =
    !message.deleted &&
    isOwner &&
    !message.fileUrl &&
    !anotherMemberMessageInConversation
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
        'group min-h-8 w-full hover:bg-zinc-200 dark:hover:bg-zinc-700 p-2 flex gap-4 items-start px-4 transition-colors relative mt-3 max-w-full',
        className
      )}
    >
      <div
        onClick={onMemberClick}
        className="cursor-pointer hover:drop-shadow-md transition"
      >
        {message?.member?.profile?.imageUrl && (
          <UserAvatar
            className="size-10 min-h-10 min-w-10"
            imageUrl={message?.member?.profile?.imageUrl}
          />
        )}
      </div>
      <div className="flex flex-col w-full overflow-hidden">
        <div className="flex items-center gap-2 truncate max-w-full">
          <div
            onClick={onMemberClick}
            className={cn(
              'font-semibold',
              message.member?.id !== currentMember.id &&
                ' hover:underline cursor-pointer'
            )}
          >
            {message.member?.profile.name}
          </div>
          <RoleIcon role={message.member?.role} />
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
            <div className="flex gap-1 items-center max-w-full w-full">
              <p
                className={cn(
                  message.deleted &&
                    'italic text-sm text-zinc-500 dark:text-zinc-400 pt-1 hyphens-manual  wrap-break-word'
                )}
              >
                {message.content}
              </p>
              {message.createdAt !== message.updatedAt && !message.deleted && (
                <span className="text-zinc-500 dark:text-zinc-400 text-sm">
                  ({t('changed')})
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
        <div className="group-hover:opacity-100 opacity-0 h-10 px-2 transition absolute -top-4 right-2 flex gap-1 items-center bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300  rounded-md z-10 border  ">
          {canEditMessage && (
            <TooltipWidget label={g('edit')}>
              <Pencil
                onClick={() => setIsEditing(!isEditing)}
                className="size-5  cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-200 "
              />
            </TooltipWidget>
          )}
          {canDeleteMessage && (
            <TooltipWidget label={g('delete')}>
              <X
                onClick={() =>
                  onOpen(ModalType.DELETE_MESSAGE, {
                    query: socketQuery,
                    apiUrl: `${socketUrl}/${message.id}`,
                    messageFileUrl: message.fileUrl ?? '',
                  })
                }
                className={cn(
                  'size-8  cursor-pointer  hover:text-zinc-700 dark:hover:text-zinc-200 '
                )}
              />
            </TooltipWidget>
          )}
        </div>
      )}
    </div>
  )
}
