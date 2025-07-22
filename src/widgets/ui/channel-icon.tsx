import { ChannelType } from '@prisma/client'
import { Hash, Mic, Video } from 'lucide-react'
import { TooltipWidget } from './tooltip'

interface Props {
  type: ChannelType
}
export const IconMap = {
  [ChannelType.TEXT]: <Hash className="size-4 min-w-4 min-h-4" />,
  [ChannelType.VOICE]: <Mic className="size-4 min-w-4 min-h-4" />,
  [ChannelType.VIDEO]: <Video className="size-4 min-w-4 min-h-4" />,
}
export  function ChannelIcon({ type }: Props) {
  return (
    <TooltipWidget label={type} side="top">
      {IconMap[type]}
    </TooltipWidget>
  )
}
