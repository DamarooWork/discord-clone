'use client'
import { Link, usePathname } from '@/i18n/navigation'
import { LOCALES_NAMES } from '@/shared/lib/contants'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui'
import { Globe } from 'lucide-react'

export  function LanguageSelector() {
  const pathname = usePathname()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Language selector</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex-col flex" align="end">
        {LOCALES_NAMES.map((name, index) => (
          <Link key={index} href={pathname} locale={name?.locale}>
            <DropdownMenuItem>{name?.name}</DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
