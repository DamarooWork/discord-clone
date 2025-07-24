'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from '@/shared/ui'
import z from 'zod'
import { cn } from '@/shared/lib/utils/cn'
import { toast } from 'sonner'
import { useRouter } from '@/i18n/navigation'
import axios from 'axios'
import { useModalStore } from '@/shared/store'
import { actionRevalidatePath } from '@/shared/lib/actions'
import { CreateChannelSchema } from './create-channel-schema'
import { ChannelType } from '@prisma/client'
import { ServerWithMembersWithProfilesAndChannelsWithProfiles } from '@/shared/types'

interface Props {
  className?: string
  children?: React.ReactNode
  server: ServerWithMembersWithProfilesAndChannelsWithProfiles
  channelType?: ChannelType
}
export function CreateChannelForm({ className, children, server, channelType }: Props) {
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(CreateChannelSchema),
    defaultValues: {
      name: '',
      type: channelType || ChannelType.TEXT,
    },
  })
  const { onClose } = useModalStore()
  const isLoading = form.formState.isSubmitting
  const onSubmit = async (values: z.infer<typeof CreateChannelSchema>) => {
    try {
      if (server.channels.find((channel) => channel.name === values.name)) {
        form.setError('name', {
          message: 'A channel with this name already exists!',
        })
        return
      }
      await axios.post(`/api/servers/${server.id}/channels`, values)
      toast.success('The channel was created!')
      form.reset()
      router.refresh()
      await actionRevalidatePath()
      onClose()
    } catch (e) {
      toast.error('Something went wrong!')
      console.log(e)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(className, ' px-4 flex flex-col gap-4 ')}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Channel name</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  {...field}
                  placeholder="for example: Chat"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type of channel</FormLabel>
              <Select
                disabled={isLoading}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(ChannelType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <footer className="py-4 flex justify-end">
          <Button
            variant="primary"
            type="submit"
            disabled={isLoading}
          >
            Create
          </Button>
        </footer>
        {children}
      </form>
    </Form>
  )
}
