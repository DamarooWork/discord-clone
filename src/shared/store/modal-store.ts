import { create } from 'zustand'
import { ServerWithMembersWithProfilesAndChannelsWithProfiles } from '@/shared/types'

export const ModalType = {
  CREATE_SERVER: 'createServer',
  INVITE: 'invite',
  EDIT_SERVER: 'editServer',
  MEMBERS: 'members',
  CREATE_CHANNEL: 'createChannel',
  DELETE_SERVER: 'deleteServer',
  LEAVE_SERVER: 'leaveServer',
} as const
export type ModalType = (typeof ModalType)[keyof typeof ModalType]

interface ModalData {
  server?: ServerWithMembersWithProfilesAndChannelsWithProfiles
}
interface ModalStore {
  type: ModalType | null
  data: ModalData
  isOpen: boolean
  onOpen: (type: ModalType, data?: ModalData) => void
  onClose: () => void
}
export const useModalStore = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ type, isOpen: true, data }),
  onClose: () => set({ type: null, isOpen: false }),
}))
