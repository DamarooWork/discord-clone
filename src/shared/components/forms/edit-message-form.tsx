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
  Button,
} from '@/shared/ui'
import z from 'zod'
import qs from 'query-string'
import { cn } from '@/shared/lib/utils'
import { ChatType, MessageWithMemberWithProfile } from '@/shared/types'
import axios from 'axios'
import { toast } from 'sonner'
import { EmojiPicker } from '@/shared/components/forms/ui'
import { Loader2 } from 'lucide-react'

interface Props {
  className?: string
  socketUrl: string
  socketQuery: Record<string, string>
  type: ChatType
  message: MessageWithMemberWithProfile
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
}
export function EditMessageForm({
  className,
  socketUrl,
  socketQuery,
  type,
  message,
  setIsEditing,
}: Props) {
  const form = useForm({
    resolver: zodResolver(ChatInputSchema),
    defaultValues: {
      content: message.content ?? '',
    },
  })
  const isLoading = form.formState.isSubmitting
  const onSubmit = async (values: z.infer<typeof ChatInputSchema>) => {
    try {
      if (values.content === message.content) {
        setIsEditing(false)
        return
      }
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${message.id}`,
        query: socketQuery,
      })
      await axios.patch(url, values)
      toast.success('Message edited!')
      form.reset()
      setIsEditing(false)
    } catch (e) {
      console.log(e)
      toast.error('Something went wrong!', {
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
        className={cn(className, 'mt-2 relative flex gap-2 items-center')}
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <div className="relative">
                  <Input
                    className="pr-12 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 "
                    disabled={isLoading}
                    placeholder={`Edited message`}
                    autoComplete="off"
                    autoFocus
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
        <Button
          className="h-12"
          variant="primary"
          type="submit"
          disabled={isLoading}
        >
           {isLoading ? <Loader2 className="size-6 mx-1  animate-spin" /> : 'Save'}
        </Button>
      </form>
      <span className="text-sm mt-1 text-zinc-400">
        Press escape to cancel, enter to save
      </span>
    </Form>
  )
}
