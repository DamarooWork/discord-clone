'use client'

import { ModalType, useModalStore } from '@/shared/store'
import { ServerWithMembersWithProfiles } from '@/shared/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui'
import { MemberRole } from '@prisma/client'
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from 'lucide-react'

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles
  role?: MemberRole
}
export function ServerHeader({ server, role }: ServerHeaderProps) {
  const isAdmin = role === MemberRole.ADMIN
  const isModerator = isAdmin || role === MemberRole.MODERATOR

  const { onOpen } = useModalStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full font-semibold flex items-center justify-between px-3 h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-neutral-300/50 dark:hover:bg-neutral-700/50 transition-all ease-in-out cursor-pointer rounded-b-md shadow-xl ">
          <p className="truncate">{server.name}</p>
          <ChevronDown className="size-5 min-w-5 min-h-5" />
          <span className="sr-only">Server with name {server.name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium">
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen(ModalType.INVITE, { server })}
            className="text-main flex justify-between items-center px-3 py-2 text-sm"
          >
            Invite people
            <span className="sr-only">Invite people</span>
            <UserPlus className="size-4 min-w-4 min-h-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen(ModalType.EDIT_SERVER, { server })}
            className="flex justify-between items-center px-3 py-2 text-sm"
          >
            Server Settings
            <span className="sr-only">Server Settings</span>
            <Settings className="size-4 min-w-4 min-h-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen(ModalType.MEMBERS, { server })}
            className="flex justify-between items-center px-3 py-2 text-sm"
          >
            Manage Members
            <span className="sr-only">Manage Members</span>
            <Users className="size-4 min-w-4 min-h-4" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem className=" flex justify-between items-center px-3 py-2 text-sm">
            Create Channel
            <span className="sr-only">Create Channel</span>
            <PlusCircle className="size-4 min-w-4 min-h-4" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            variant="destructive"
            className="text-destructive flex justify-between items-center  px-3 py-2 text-sm"
          >
            Delete Server
            <span className="sr-only"> Delete Server</span>
            <Trash className="size-4 min-w-4 min-h-4 text-destructive" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            variant="destructive"
            className="text-destructive flex justify-between items-center px-3 py-2 text-sm"
          >
            Leave Server
            <span className="sr-only"> Leave Server</span>
            <LogOut className="size-4 min-w-4 min-h-4 text-destructive" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
