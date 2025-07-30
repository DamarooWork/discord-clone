'use client'
import {
  ChatType,
  MessageWithMemberWithProfile,
  ParamKeyType,
} from '@/shared/types'
import { Member } from '@prisma/client'
import { ChatWelcome } from './chat-welcome'
import { useChatQuery, useChatScroll, useChatSocket } from '@/shared/hooks'
import { Loader2, ServerCrash } from 'lucide-react'
import { Fragment, useRef } from 'react'
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
  const addKey = `chat:${chatId}:messages`
  const updateKey = `chat:${chatId}:messages:update`

  const chatRef = useRef<HTMLElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      apiUrl,
      paramKey,
      paramValue,
      queryKey,
    })
  useChatSocket({
    addKey,
    updateKey,
    queryKey,
  })
  useChatScroll({
    chatRef,
    bottomRef,
    triggerLoadMore: fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0
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
    <section
      ref={chatRef}
      className={'flex-1 flex flex-col py-4 overflow-y-auto'}
    >
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome type={type} name={name} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="size-8  animate-spin" />
          ) : (
            <button
              className=" text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer transition ease-in-out"
              onClick={() => fetchNextPage()}
            >
              Load More
            </button>
          )}
        </div>
      )}
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
      <div ref={bottomRef} />
    </section>
  )
}
