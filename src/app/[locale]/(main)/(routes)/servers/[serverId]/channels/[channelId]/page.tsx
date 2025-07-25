import { ChannelPage } from '@/views'
interface Props {
  params: Promise<{ serverId: string; channelId: string }>
}
export default async function Channel({ params }: Props) {
  const { serverId, channelId } = await params
  return <ChannelPage serverId={serverId} channelId={channelId} />
}
