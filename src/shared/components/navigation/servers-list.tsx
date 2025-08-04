'use client'
import { ScrollArea } from '@/shared/ui'
import { Server } from '@prisma/client'
import { ServerItem } from './server-item'
interface Props {
  servers: Server[]
}
export function ServersList({ servers }: Props) {
  return (
    <ScrollArea className="flex-1 w-full  max-h-[calc(100dvh-280px)]">
      <ul className="flex flex-col gap-3 items-center relative ">
        {servers.map((server) => (
          <ServerItem server={server} key={server.id} />
        ))}
      </ul>
    </ScrollArea>
  )
}
