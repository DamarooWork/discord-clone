import { ConversationPage } from '@/views'
interface Props {
  params: Promise<{ serverId: string; memberId: string }>
  searchParams: Promise<{ video: boolean }>
}
export default async function Conversation({ params, searchParams }: Props) {
  const { serverId, memberId } = await params
  const { video } = await searchParams

  return (
    <ConversationPage serverId={serverId} memberId={memberId} video={video} />
  )
}
