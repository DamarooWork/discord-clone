import { useEffect, RefObject, useCallback, useState } from 'react'

interface ChatScrollProps {
  chatRef: RefObject<HTMLElement | null>
  bottomRef: RefObject<HTMLDivElement | null>
  triggerLoadMore: () => void
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  count?: number
}

export function useChatScroll({
  chatRef,
  bottomRef,
  triggerLoadMore,
  hasNextPage = false,
  isFetchingNextPage = false,
  count,
}: ChatScrollProps) {
  const [hasInitialized, setHasInitialized] = useState(false)
  const handleScroll = useCallback(() => {
    if (!chatRef.current) return

    // Проверяем, достиг ли пользователь верха чата (scrollTop === 0)
    if (chatRef.current.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      triggerLoadMore()
    }
  }, [chatRef, hasNextPage, isFetchingNextPage, triggerLoadMore])

  useEffect(() => {
    if (!chatRef.current) {
      return
    }

    chatRef.current.addEventListener('scroll', handleScroll)
    return () => {
      chatRef.current?.removeEventListener('scroll', handleScroll)
    }
  }, [chatRef, handleScroll])

  useEffect(() => {
    if (!chatRef.current) {
      return
    }
    const bottomDiv = bottomRef.current
    const topDiv = chatRef.current
    const shouldAutoScroll = ()=>{
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true)
        return true
      }
      if (!topDiv) {
        return false
      }
      const scrollBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight
      return scrollBottom <= 100
    }
    if (shouldAutoScroll()) {
      setTimeout(() => {
        if (bottomDiv) {
          bottomDiv.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [hasInitialized, bottomRef, chatRef, count])
}
