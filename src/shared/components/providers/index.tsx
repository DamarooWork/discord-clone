'use client'
import { QueryClientProvider } from './query-client-provider'
import { ThemeProvider } from './theme-provider'
import ClerkProvider from './clerk-provider'
import { Toaster } from '@/shared/ui'
import { ModalsProvider } from './modals-provider'
import NextTopLoader from 'nextjs-toploader'
import { SocketProvider } from './socket-provider'
import { QueryProvider } from './query-provider'
interface Props {
  children: React.ReactNode
}
export function Providers({ children }: Props) {
  return (
    <ClerkProvider>
      <QueryClientProvider>
        <ThemeProvider>
          <SocketProvider>
            <QueryProvider>
              <ModalsProvider />
              <NextTopLoader
                color={'oklch(58.5% 0.233 277.117)'}
                showSpinner={false}
              />
              <Toaster richColors />
              {children}
            </QueryProvider>
          </SocketProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  )
}
