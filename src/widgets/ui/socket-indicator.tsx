'use client'
import { useSocket } from '@/shared/components/providers/socket-provider'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui'

interface Props {
  className?: string
}
export function SocketIndicator({ className }: Props) {
  const { isConnected } = useSocket()

  return (
    <Badge
      className={cn(
        'text-white border-none',
        isConnected ? 'bg-emerald-600' : 'bg-yellow-600',
        className
      )}
      variant='outline'
    >
      {isConnected ? 'Live: Real-time updates' : 'Fallback: Polling every 1s '}
    </Badge>
  )
}
