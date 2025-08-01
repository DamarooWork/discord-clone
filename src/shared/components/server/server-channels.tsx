import { ServerWithMembersWithProfilesAndChannelsWithProfiles } from '@/shared/types'
import { ChannelType, MemberRole } from '@prisma/client'
import { ServerChannel, ServerSection } from '@/shared/components/server'
import { useTranslations } from 'next-intl'

interface Props {
  server: ServerWithMembersWithProfilesAndChannelsWithProfiles
  role?: MemberRole
}
export function ServerChannels({ server, role }: Props) {
  const t =  useTranslations('server')
  return (
    <>
      {Object.values(ChannelType).map((type) => {
        if (
          server.channels.filter((channel) => channel.type === type)?.length
        ) {
          return (
            <section
              className="flex flex-col w-full max-w-full mb-4"
              key={type}
            >
              <ServerSection
                label={type + ` ${t('channels')}`}
                sectionType="channels"
                channelType={type}
                server={server}
                role={role}
              />
              {server.channels
                .filter((channel) => channel.type === type)
                .map((channel) => (
                  <ServerChannel
                    key={channel.id}
                    channel={channel}
                    server={server}
                    role={role}
                  />
                ))}
            </section>
          )
        }
      })}
    </>
  )
}
