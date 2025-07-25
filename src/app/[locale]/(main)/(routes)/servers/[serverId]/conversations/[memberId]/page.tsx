import { ConversationPage } from '@/views'
interface Props {
  params: Promise<{ serverId: string; memberId: string }>
}
export default async function Conversation({ params }: Props) {
  const { serverId, memberId } = await params
 
  return <ConversationPage serverId={serverId} memberId={memberId} />
}
