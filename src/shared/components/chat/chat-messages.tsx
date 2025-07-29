'use client'
import {
  ChatType,
  MessageWithMemberWithProfile,
  ParamKeyType,
} from '@/shared/types'
import { Member } from '@prisma/client'
import { ChatWelcome } from './chat-welcome'
import { useChatQuery } from '@/shared/hooks'
import { Loader2, ServerCrash } from 'lucide-react'
import { Fragment } from 'react'
import { ChatItem } from './chat-item'
import { useLocale } from 'next-intl'
import { DATE_FORMAT, getDateFnsLocale } from '@/shared/lib/contants'
import { format } from 'date-fns'

interface ChatMessagesProps {
  name: string
  type: ChatType
  member: Member
  chatId: string
  apiUrl: string
  socketUrl: string
  socketQuery: Record<string, string>
  paramKey: ParamKeyType
  paramValue: string
}
export function ChatMessages({
  type,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  name,
}: ChatMessagesProps) {
  const queryKey = `chat:${chatId}`
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      apiUrl,
      paramKey,
      paramValue,
      queryKey,
    })
  const locale = useLocale()
  const dateFnsLocale = getDateFnsLocale(locale)
  if (status === 'pending') {
    return (
      <section className={'flex-1 flex flex-col justify-center items-center'}>
        <Loader2 className="size-16 text-zinc-500 dark:text-zinc-400 my-2 animate-spin" />
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Loading messages...
        </p>
      </section>
    )
  }
  if (status === 'error') {
    return (
      <section className={'flex-1 flex flex-col justify-center items-center'}>
        <ServerCrash className="size-16 text-zinc-500 dark:text-zinc-400 my-2" />
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Something went wrong
        </p>
      </section>
    )
  }

  return (
    <section className={'flex-1 flex flex-col py-4 overflow-y-auto'}>
      <div className="flex-1" />
      <ChatWelcome type={type} name={name} />
      <div className="flex flex-col-reverse">
        {data?.pages.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                message={message}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
                currentMember={member}
                messageDate={format(new Date(message.createdAt), DATE_FORMAT, {
                  locale: dateFnsLocale,
                })}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </section>
  )
}
