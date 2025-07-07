'use client'
import { QueryClientProvider } from './query-client-provider'
import { ThemeProvider } from './theme-provider'
import ClerkProvider from './clerk-provider'
interface Props {
  children: React.ReactNode
}
export function Providers({ children }: Props) {
  return (
      <ClerkProvider>
        <QueryClientProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryClientProvider>
      </ClerkProvider>
  )
}
