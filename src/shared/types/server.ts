import { Channel, Member, Profile, Server } from '@prisma/client'

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[]
}

export type ServerWithChannelsWithProfiles = Server & {
  channels: (Channel & { profile: Profile })[]
}

export type ServerWithMembersWithProfilesAndChannelsWithProfiles = Server & {
  members: (Member & { profile: Profile })[]
} & { channels: (Channel & { profile: Profile })[] }

export type MemberWithProfile = Member & { profile: Profile }