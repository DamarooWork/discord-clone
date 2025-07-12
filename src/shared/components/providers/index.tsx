'use client'
import { QueryClientProvider } from './query-client-provider'
import { ThemeProvider } from './theme-provider'
import ClerkProvider from './clerk-provider'
import { Toaster } from '@/shared/ui'
interface Props {
  children: React.ReactNode
}
export function Providers({ children }: Props) {
  return (
    <ClerkProvider>
      <QueryClientProvider>
        <ThemeProvider>
          {children} <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  )
}
