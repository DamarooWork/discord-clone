'use client'
import { Server } from '@prisma/client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/shared/lib/utils'
import { TooltipWidget } from '@/widgets'
import { useParams } from 'next/navigation'

interface Props {
  server: Server
}
export function ServerItem({ server }: Props) {
  const params = useParams()
  const serverId = params?.serverId
  return (
    <li className="relative group">
      <div
        className={cn(
          'rounded-r-2xl w-1 bg-foreground absolute -left-4',
          serverId === server.id
            ? 'h-full top-0 -left-3 transition-all ease-in-out'
            : 'group-hover:h-1/2 top-1/2  group-hover:translate-x-1 -translate-y-1/2 transition-all ease-in-out'
        )}
      />
      <TooltipWidget label={server.name} side="right">
        <Link
          href={`/servers/${server.id}`}
          className={cn('block relative size-12 group/link group-active:translate-y-0.5 transition-all')}
        >
          <Image
            src={server.imageUrl}
            alt={server.name}
            fill
            className="rounded-3xl group-hover/link:rounded-md transition-all ease-in-out object-cover"
            sizes='48px'
            priority
          />
        </Link>
      </TooltipWidget>
    </li>
  )
}
