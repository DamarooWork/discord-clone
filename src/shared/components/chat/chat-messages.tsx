import { ChatType } from "@/shared/types"

interface Props {
  profileId: string
  serverId: string
  type: ChatType
  channelId?: string

}
export  function  ChatMessages({}:Props){

  return (
    <section className={'flex-1'}>
      
    </section>
  )
}