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
  FormLabel,
  FormMessage,
  Button,
} from '@/shared/ui'
import z from 'zod'
import { cn } from '@/shared/lib/utils'

interface Props {
  className?: string
}
export function ChatInputForm({ className }: Props) {
  const form = useForm({
    resolver: zodResolver(ChatInputSchema),
    defaultValues: {
      content: '',
    },
  })
  const isLoading = form.formState.isSubmitting
  const onSubmit = async (value: z.infer<typeof ChatInputSchema>) => {
    console.log(value)
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(className, ' px-4 flex flex-col gap-4 relative')}
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Input
                className='h-20'
                  disabled={isLoading}
                  {...field}
                  placeholder={'type your message here'}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="absolute bottom-2 right-6"
          variant="primary"
          type="submit"
          disabled={isLoading}
        >
          Send
        </Button>
      </form>
    </Form>
  )
}
