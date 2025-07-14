import { CreateServerModal, EditServerModal, InviteModal } from '@/shared/components/modals'

export function ModalsProvider() {
  return (
    <>
      <CreateServerModal />
      <InviteModal/>
      <EditServerModal />
    </>
  )
}
