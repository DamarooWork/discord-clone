import { LOCALES } from '@/shared/lib/contants'
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: LOCALES,

  // Used when no locale matches
  defaultLocale: 'ru',
  localePrefix: 'as-needed',
})
