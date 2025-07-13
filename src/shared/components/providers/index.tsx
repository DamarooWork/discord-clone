'use client'
import { QueryClientProvider } from './query-client-provider'
import { ThemeProvider } from './theme-provider'
import ClerkProvider from './clerk-provider'
import { Toaster } from '@/shared/ui'
import { ModalsProvider } from './modals-provider'
interface Props {
  children: React.ReactNode
}
export function Providers({ children }: Props) {
  return (
    <ClerkProvider>
      <QueryClientProvider>
        <ThemeProvider>
          <ModalsProvider/>
          {children} <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  )
}
