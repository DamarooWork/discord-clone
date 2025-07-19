import { CreateChannelModal, CreateServerModal, DeleteServerModal, EditServerModal, InviteModal, MembersModal } from '@/shared/components/modals'

export function ModalsProvider() {
  return (
    <>
      <CreateServerModal />
      <InviteModal/>
      <EditServerModal />
      <MembersModal/>
      <CreateChannelModal/>
      <DeleteServerModal/>
    </>
  )
}
