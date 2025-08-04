'use client'
import { useSocket } from '@/shared/components/providers/socket-provider'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui'
import { useTranslations } from 'next-intl'

interface Props {
  className?: string
}
export function SocketIndicator({ className }: Props) {
  const { isConnected } = useSocket()
  const t = useTranslations('chat')
  return (
    <Badge
      className={cn(
        'text-white border-none',
        isConnected ? 'bg-emerald-600' : 'bg-yellow-600',
        className
      )}
      variant="outline"
    >
      {isConnected ? t('socket_live') : t('socket_fallback')}
    </Badge>
  )
}
