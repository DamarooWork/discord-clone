'use client'
import { ServerWithMembersWithProfilesAndChannelsWithProfiles } from '@/shared/types'
import { ServerMember } from './server-member'
import { ServerSection } from './server-section'
import { MemberRole } from '@prisma/client'
import { useModalStore } from '@/shared/store'
import { ModalType } from '@/shared/store/modal-store'
import { useTranslations } from 'next-intl'

interface Props {
  server: ServerWithMembersWithProfilesAndChannelsWithProfiles
  role?: MemberRole
  profileId: string
}
export function ServerMembers({ server, role, profileId }: Props) {
  const members = server.members.filter(
    (member) => member.profileId !== profileId
  )
  const t = useTranslations('server')
  const { onOpen } = useModalStore()
  return (
    <>
      <ServerSection
        label={t('members')}
        sectionType="members"
        server={server}
        role={role}
      />
      {!members?.length && (
        <p
          onClick={() => onOpen(ModalType.INVITE, { server })}
          className="font-bold text-main hover:underline cursor-pointer text-sm  "
        >
          {t('no_members')}
        </p>
      )}
      {members.map((member) => (
        <ServerMember key={member.profileId} member={member} />
      ))}
    </>
  )
}
