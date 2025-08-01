'use client'

import { usePathname, useRouter } from '@/i18n/navigation'
import { TooltipWidget } from '@/widgets'
import { Video, VideoOff } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import qs from 'query-string'

export function ChatVideoButton() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isVideo = searchParams?.get('video')

  const Icon = isVideo ? VideoOff : Video
  const tooltipLabel = isVideo ? 'End video call' : 'Start video call'

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true }
    )

    router.push(url)
  }
  return (
    <TooltipWidget label={tooltipLabel} side={'bottom'}>
      <button
        onClick={onClick}
        className="hover:opacity-75 transition-opacity mr-4 cursor-pointer"
      >
        <Icon className="size-6 text-zinc-500 dark:text-zinc-400 " />
      </button>
    </TooltipWidget>
  )
}
