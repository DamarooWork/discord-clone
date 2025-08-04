'use client'
import { useForm } from 'react-hook-form'
import { ChatInputSchema } from './chat-input-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  Input,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/ui'
import z from 'zod'
import qs from 'query-string'
import { cn } from '@/shared/lib/utils'
import { Plus } from 'lucide-react'
import { ChatType } from '@/shared/types'
import axios from 'axios'
import { toast } from 'sonner'
import { ModalType, useModalStore } from '@/shared/store'
import { EmojiPicker } from '@/shared/components/forms/ui'
import { useTranslations } from 'next-intl'

interface Props {
  className?: string
  apiUrl: string
  query: Record<string, any>
  name: string
  type: ChatType
}
export function ChatInputForm({ className, apiUrl, query, name, type }: Props) {
  const { onOpen } = useModalStore()
  const t = useTranslations('general')
  const c = useTranslations('chat')

  const form = useForm({
    resolver: zodResolver(ChatInputSchema),
    defaultValues: {
      content: '',
    },
  })
  const isLoading = form.formState.isSubmitting
  const onSubmit = async (values: z.infer<typeof ChatInputSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      })
      await axios.post(url, values)
      form.reset()
    } catch (e) {
      console.log(e)
      toast.error(t('error_message'), {
        position: 'top-right',
      })
    }
  }
  const handleEmojiPick = (emoji: string) => {
    form.setValue('content', form.getValues('content') + emoji)
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(className, 'p-2 md:p-3 relative')}
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      onOpen(ModalType.MESSAGE_FILE, { apiUrl, query })
                    }}
                    className="absolute top-3 left-3 h-6 w-6 bg-zinc-500 dark:bg-zinc-400 rounded-full hover:bg-zinc-600 dark:hover:bg-zinc-300 transition-colors p-1 flex items-center justify-center z-10 cursor-pointer"
                  >
                    <Plus className="h-4 w-4 text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    className="px-12 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    disabled={isLoading}
                    placeholder={`${c('input_placeholder')} ${
                      type === 'conversation' ? name : '#' + name
                    } `}
                    autoComplete="off"
                    {...field}
                  />
                  <EmojiPicker
                    onChange={handleEmojiPick}
                    className="absolute top-3 right-3"
                  />
                </div>
              </FormControl>
              <FormMessage className="sr-only" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
