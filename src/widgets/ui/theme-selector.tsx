'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/shared/ui'

export function ThemeSelector() {
  const { setTheme, theme } = useTheme()

  function handleClick() {
    theme === 'dark' ? setTheme('light') : setTheme('dark')
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='size-12' onClick={handleClick} variant="outline" size="icon">
          <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 delay-200" />
          <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
    </DropdownMenu>
  )
}
