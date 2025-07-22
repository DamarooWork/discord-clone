'use client'
import { ScrollArea } from '@/shared/ui'

import { Server } from '@prisma/client'
import { ServerItem } from './server-item'
interface Props {
  className?: string
  servers: Server[]
}
export function ServersList({ className, servers }: Props) {
  return (
    <ScrollArea className="flex-1 w-full">
      <ul className="flex flex-col gap-3 items-center relative ">
        {servers.map((server) => (
          <ServerItem server={server} key={server.id} />
        ))}
      </ul>
    </ScrollArea>
  )
}
