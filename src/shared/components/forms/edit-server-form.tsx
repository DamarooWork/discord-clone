'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CreateServerSchema } from './create-server-schema'
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
import { FileUploader } from '@/widgets'
import { toast } from 'sonner'
import axios from 'axios'
import { useModalStore } from '@/shared/store'
import { actionRevalidatePath } from '@/shared/lib/actions'
import { Server } from '@prisma/client'

interface Props {
  className?: string
  children?: React.ReactNode
  server?: Server
}
export function EditServerForm({ className, children, server }: Props) {
  const form = useForm({
    resolver: zodResolver(CreateServerSchema),
    defaultValues: {
      name: server?.name ?? '',
      imageUrl: server?.imageUrl ?? '',
    },
  })
  const { onClose } = useModalStore()

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof CreateServerSchema>) => {
    if (
      server?.name === form.getValues('name') &&
      server?.imageUrl === form.getValues('imageUrl')
    ) {
      toast.success('Change something for update!')
      return
    }
    try {
      await axios.patch(`/api/servers/${server?.id}`, values)
      toast.success('The server was updated!')
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
        className={cn(className, 'space-y-4')}
      >
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Server image
              </FormLabel>
              <FormControl>
                <FileUploader
                  endpoint="imageUploader"
                  value={field.value}
                  isLoading={isLoading}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Server name
              </FormLabel>
              <FormControl>
                <Input
                  className=" "
                  disabled={isLoading}
                  {...field}
                  placeholder="for example: My Server"
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
            Save
          </Button>
        </footer>
        {children}
      </form>
    </Form>
  )
}
