import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui'
import { cn } from '../lib/utils'

interface Props {
  className?: string
  imageUrl?: string
}
export function UserAvatar({ className, imageUrl }: Props) {
  return (
    <Avatar className={cn(className, 'size-7 min-h-7 min-w-7 md:size-10 md:min-h-10 md:min-w-10')}>
      <AvatarImage src={imageUrl} alt="UserAvatar" className={className} />
    </Avatar>
  )
}
