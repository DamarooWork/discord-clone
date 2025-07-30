'use client'
import { useRouter } from '@/i18n/navigation'
import { cn } from '@/shared/lib/utils'
import { MemberWithProfile } from '@/shared/types'
import { RoleIcon } from '@/widgets'
import { useParams } from 'next/navigation'
import { UserAvatar } from '@/shared/components'

interface Props {
  member: MemberWithProfile
}
export function ServerMember({ member }: Props) {
  const router = useRouter()
  const params = useParams()
  const handleMemberClick = () => {
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
  }
  return (
    <button
      onClick={handleMemberClick}
      className={cn(
        'group p-2 flex items-center gap-2 rounded-md w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition cursor-pointer',
        params?.memberId === member.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      <UserAvatar
        className="size-6 min-h-6 min-w-6 md:size-8 md:min-h-8 md:min-w-8"
        imageUrl={member?.profile?.imageUrl}
      />
      <p
        className={cn(
          'font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition-all ease-in-out',
          params?.memberId === member.id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {member.profile.name}
      </p>
      <RoleIcon role={member.role} />
    </button>
  )
}
