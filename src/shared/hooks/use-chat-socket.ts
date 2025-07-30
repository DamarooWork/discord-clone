import { useSocket } from '@/shared/components/providers/socket-provider'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { MessageWithMemberWithProfile } from '../types'

interface ChatSocketProps {
  addKey: string
  updateKey: string
  queryKey: string
}
export function useChatSocket({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) {
  const { socket } = useSocket()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!socket) {
      return
    }
    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || !oldData.pages.length) {
          return oldData
        }
        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberWithProfile) => {
              if (item.id === message.id) {
                return message
              }
              return item
            }),
          }
        })
        return {
          ...oldData,
          pages: newData,
        }
      })
    })
    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || !oldData.pages.length) {
          return {
            pages: [{ items: [message] }],
          }
        }
        const newData = [...oldData.pages]
        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        }
        return {
          ...oldData,
          pages: newData,
        }
      })
    })
    return () => {
      socket.off(addKey)
      socket.off(updateKey)
    }
  }, [queryClient, addKey, updateKey, queryKey, socket])
  return
}
