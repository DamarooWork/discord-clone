import { CreateChannelModal, CreateServerModal, EditServerModal, InviteModal, MembersModal } from '@/shared/components/modals'

export function ModalsProvider() {
  return (
    <>
      <CreateServerModal />
      <InviteModal/>
      <EditServerModal />
      <MembersModal/>
      <CreateChannelModal/>
    </>
  )
}
