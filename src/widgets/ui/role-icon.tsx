import { MemberRole } from '@prisma/client'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { TooltipWidget } from '@/widgets'

const roleIconMap = {
  [MemberRole.ADMIN]: (
    <ShieldAlert className="size-4 min-w-4 min-h-4 text-rose-500" />
  ),
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="size-4 min-w-4 min-h-4 text-main " />
  ),
  [MemberRole.GUEST]: null,
}
interface RoleIconProps {
  role: MemberRole
}
export function RoleIcon({ role }: RoleIconProps) {
  return (
    <TooltipWidget label={role} side="top">
      {roleIconMap[role]}
    </TooltipWidget>
  )
}
