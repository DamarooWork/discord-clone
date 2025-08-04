import { cn } from '@/shared/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui'
import { Portal as RadixTooltipPortal } from '@radix-ui/react-tooltip'

interface TooltipWidgetProps {
  children: React.ReactNode
  label: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  delayDuration?: number
  className?: string
}
export function TooltipWidget({
  children,
  label,
  side = 'top',
  align = 'center',
  delayDuration = 250,
  className,
}: TooltipWidgetProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger className={cn('', className)} asChild>
          {children}
        </TooltipTrigger>
        <RadixTooltipPortal>
          <TooltipContent
            side={side}
            align={align}
            style={{ pointerEvents: 'none' }}
          >
            <p className="font-semibold text-sm">{label}</p>
          </TooltipContent>
        </RadixTooltipPortal>
      </Tooltip>
    </TooltipProvider>
  )
}
