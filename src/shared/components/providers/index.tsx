'use client'
import { QueryClientProvider } from './query-client-provider'
import { ThemeProvider } from './theme-provider'
import NextAuthProvider from './next-auth-provider'
interface Props {
  children: React.ReactNode
}
export function Providers({ children }: Props) {
  return (
      <NextAuthProvider>
        <QueryClientProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryClientProvider>
      </NextAuthProvider>
  )
}
