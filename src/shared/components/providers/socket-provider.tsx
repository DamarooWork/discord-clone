'use client'
import { SocketContextType } from '@/shared/types'
import { useLocale } from 'next-intl'
import { useEffect, useState, createContext, useContext } from 'react'
import { io as ClientIO } from 'socket.io-client'
interface Props {
  className?: string
  children: React.ReactNode
}
const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export function useSocket() {
  return useContext(SocketContext)
}

export function SocketProvider({ children }: Props) {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const locale = useLocale()
  useEffect(() => {
    const socketInstance = new (ClientIO as any)(
      process.env.NEXT_PUBLIC_SITE_URL,
      {
        path: `/api/socket/io`,
        addTrailingSlash: false,
      }
    )
      .on('connect', () => {
        setIsConnected(true)
      })
      .on('disconnect', () => {
        setIsConnected(false)
      })
    setSocket(socketInstance)
    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}
