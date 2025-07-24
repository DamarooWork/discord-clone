import { ServerWithMembersWithProfilesAndChannelsWithProfiles } from '@/shared/types'
import { ServerMember } from './server-member'
import { ServerSection } from './server-section'
import { MemberRole } from '@prisma/client'

interface Props {
  server: ServerWithMembersWithProfilesAndChannelsWithProfiles
  role?: MemberRole
  profileId: string
}
export function ServerMembers({ server, role, profileId }: Props) {
  const members = server.members.filter(
    (member) => member.profileId !== profileId
  )
  return (
    <>
      <ServerSection
        label="Members"
        sectionType="members"
        server={server}
        role={role}
      />
      {!members?.length && <p>Only one member here - you!</p>}
      {members.map((member) => (
        <ServerMember key={member.profileId} member={member} />
      ))}
    </>
  )
}
