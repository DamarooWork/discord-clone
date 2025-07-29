'use client'
import { ParamKeyType } from '@/shared/types'
import { useSocket } from '@/shared/components/providers/socket-provider'
import { useInfiniteQuery } from '@tanstack/react-query'
import qs from 'query-string'

interface ChatQueryProps {
  queryKey: string
  apiUrl: string
  paramKey: ParamKeyType
  paramValue: string
}

export function useChatQuery({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps) {
  const { isConnected } = useSocket()
  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true }
    )
    const res = await fetch(url)
    return res.json()
  }
  const { data, isFetchingNextPage, status, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
      initialPageParam: undefined,
    })
  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  }
}
