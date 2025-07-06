'use client'
import { PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider as Provider } from '@tanstack/react-query'
export function QueryClientProvider({ children }: PropsWithChildren) {
  const queryClient = new QueryClient()
  return (
    <>
      <Provider client={queryClient}>{children}</Provider>
    </>
  )
}
