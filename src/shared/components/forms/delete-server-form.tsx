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
import { actionDeleteUploadThingFile, actionRevalidatePath } from '@/shared/lib/actions'
import { DeleteServerSchema } from './delete-server-schema'
import { Server } from '@prisma/client'

interface Props {
  className?: string
  children?: React.ReactNode
  server?: Server
}
export function DeleteServerForm({ className, children, server }: Props) {
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(DeleteServerSchema),
    defaultValues: {
      name: '',
    },
  })
  const { onClose } = useModalStore()
  const isLoading = form.formState.isSubmitting
  const onSubmit = async (values: z.infer<typeof DeleteServerSchema>) => {
    try {
      if (values.name !== server?.name) {
        form.setError('name',  {
          type: 'manual',
          message: 'Server name is not match',
        })
        return
      }
      await axios.delete(`/api/servers/${server?.id}`)
      await actionDeleteUploadThingFile(server?.imageUrl)
      toast.success('The server was deleted!')
      form.reset()
      await actionRevalidatePath()
      onClose()
      router.push(`/`)
    } catch (e) {
      toast.error('Something went wrong!')
      console.log(e)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(className, 'flex flex-col gap-2 ')}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type server name</FormLabel>
              <FormControl>
                <Input
                  className=""
                  disabled={isLoading}
                  {...field}
                  placeholder="server name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <footer className="py-4 flex justify-end">
          <Button
            variant="destructive"
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            Delete
          </Button>
        </footer>
        {children}
      </form>
    </Form>
  )
}
