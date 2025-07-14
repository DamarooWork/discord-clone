
import { ServerPage } from '@/views'

interface ServersPageProps {
  params: Promise<{ serverId: string }>
}
export default async function Server({ params }: ServersPageProps) {
  const { serverId } = await params
 
  return <ServerPage serverId={serverId} />
}
