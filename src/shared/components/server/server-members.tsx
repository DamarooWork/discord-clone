'use client'
import { ServerWithMembersWithProfilesAndChannelsWithProfiles } from '@/shared/types'
import { ServerMember } from './server-member'
import { ServerSection } from './server-section'
import { MemberRole } from '@prisma/client'
import { useModalStore } from '@/shared/store'
import { ModalType } from '@/shared/store/modal-store'

interface Props {
  server: ServerWithMembersWithProfilesAndChannelsWithProfiles
  role?: MemberRole
  profileId: string
}
export function ServerMembers({ server, role, profileId }: Props) {
  const members = server.members.filter(
    (member) => member.profileId !== profileId
  )
  const { onOpen } = useModalStore()
  return (
    <>
      <ServerSection
        label="Members"
        sectionType="members"
        server={server}
        role={role}
      />
      {!members?.length && (
        <p className="text-zinc-500 dark:text-zinc-400">
          There are no members yet,{' '}
          <span   onClick={() => onOpen(ModalType.INVITE, { server })} className="font-bold text-main hover:underline cursor-pointer">
            invite
          </span>{' '}
          them!
        </p>
      )}
      {members.map((member) => (
        <ServerMember key={member.profileId} member={member} />
      ))}
    </>
  )
}
