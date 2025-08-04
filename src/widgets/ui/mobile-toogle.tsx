'use client'
import { Menu } from 'lucide-react'
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui'
interface MobileToogleProps {
  children?: React.ReactNode
}
export function MobileToogle({ children }: MobileToogleProps) {
  return (
    <Sheet >
      <SheetTrigger  asChild>
        <Button variant={'ghost'} size={'icon'} className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent onOpenAutoFocus={(e) => e.preventDefault()} side="left" className="p-0 flex gap-0 w-78">
        <SheetTitle className="sr-only">Sheet Title</SheetTitle>
        <SheetDescription className="sr-only">
          Sheet Description
        </SheetDescription>

        {children}
      </SheetContent>
    </Sheet>
  )
}
