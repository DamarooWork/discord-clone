import { ChatType } from '@/shared/types'
import { Hash } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Props {
  type: ChatType
  name: string
}
export function ChatWelcome({ type, name }: Props) {
  const t = useTranslations('chat')
  return (
    <section className={'space-y-2 px-4 mb-4'}>
      {type === 'channel' && (
        <div className="flex items-center justify-center size-19 rounded-full bg-zinc-500 dark:bg-zinc-700">
          <Hash className="size-12 text-white" />
        </div>
      )}
      <p className="text-xl md:text-3xl font-bold">
        {type === 'channel' ? `${t('welcome_to')} #` : ''}
        {name}
      </p>
      <p className='text-zinc-500 dark:text-zinc-400 text-sm'>
        {type === 'channel' ? `${t('start_channel')} #${name}` : `${t('start_conversation')} ${name}`}
      </p>
    </section>
  )
}
