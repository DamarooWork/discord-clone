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
} from '@/shared/ui'
import z from 'zod'
import { cn } from '@/shared/lib/utils/cn'
import { toast } from 'sonner'
import { useRouter } from '@/i18n/navigation'
import axios from 'axios'
import { useModalStore } from '@/shared/store'
import { actionRevalidatePath } from '@/shared/lib/actions'
import { Channel } from '@prisma/client'
import { ServerWithMembersWithProfilesAndChannelsWithProfiles } from '@/shared/types'
import { EditChannelSchema } from './edit-channel-schema'
import { useTranslations } from 'next-intl'

interface Props {
  className?: string
  children?: React.ReactNode
  channel: Channel
  server: ServerWithMembersWithProfilesAndChannelsWithProfiles
}
export function EditChannelForm({
  className,
  children,
  channel,
  server,
}: Props) {
  const g = useTranslations('general')
  const t = useTranslations('edit_channel_modal')
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(EditChannelSchema),
    defaultValues: {
      name: channel.name ?? '',
    },
  })
  const { onClose } = useModalStore()
  const isLoading = form.formState.isSubmitting
  const onSubmit = async (values: z.infer<typeof EditChannelSchema>) => {
    try {
      if (values.name === channel.name) {
        form.setError('name', {
          message: t('form_error_same_name'),
        })
        return
      }
      if (server.channels.find((channel) => channel.name === values.name)) {
        form.setError('name', {
          message: t('form_error_name_exists'),
        })
        return
      }
      await axios.patch(
        `/api/servers/${server.id}/channels/${channel.id}`,
        values
      )
      toast.success(t('updated_channel_toast'))
      router.refresh()
      await actionRevalidatePath()
      onClose()
    } catch (e) {
      toast.error(t('error_message'))
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
                  placeholder={channel.name}
                />
              </FormControl>
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
            {g('save')}
          </Button>
        </footer>
        {children}
      </form>
    </Form>
  )
}
