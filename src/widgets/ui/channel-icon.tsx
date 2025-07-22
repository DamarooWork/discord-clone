import { ChannelType } from '@prisma/client'
import { Hash, Mic, Video } from 'lucide-react'
import { TooltipWidget } from './tooltip'

interface Props {
  type: ChannelType
}
 const IconMap = {
  [ChannelType.TEXT]: <Hash className="size-5 min-w-5 min-h-5" />,
  [ChannelType.VOICE]: <Mic className="size-5 min-w-5 min-h-5" />,
  [ChannelType.VIDEO]: <Video className="size-5 min-w-5 min-h-5" />,
}
export  function ChannelIcon({ type }: Props) {
  return (
    <TooltipWidget label={type} side="top">
      {IconMap[type]}
    </TooltipWidget>
  )
}
