import { ru, enUS, ja, ko, es } from 'date-fns/locale'

export const LOCALES = ['ru', 'en', 'ja', 'ko', 'es']
export const LOCALES_NAMES = [
  { locale: 'ru', name: 'Русский' },
  { locale: 'en', name: 'English' },
  { locale: 'ja', name: '日本語' },
  { locale: 'ko', name: '한국어' },
  { locale: 'es', name: 'Español' },
]
// Функция для получения локали date-fns
export const getDateFnsLocale = (locale: string) => {
  switch (locale) {
    case 'ru':
      return ru
    case 'en':
      return enUS
    case 'ja':
      return ja
    case 'ko':
      return ko
    case 'es':
      return es
    default:
      return enUS
  }
}

export const MESSAGES_BATCH = 10
export const DATE_FORMAT = 'd MMM yyyy, HH:mm'
