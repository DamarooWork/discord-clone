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
import { useRouter } from '@/i18n/navigation'
import axios from 'axios'
import { useModalStore } from '@/shared/store'
import { actionRevalidatePath } from '@/shared/lib/actions'

interface Props {
  className?: string
  children?: React.ReactNode
}
export function CreateServerForm({ className, children }: Props) {
  const router = useRouter()  
  const form = useForm({
    resolver: zodResolver(CreateServerSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
    },
  })
const {onClose} = useModalStore()
  const isLoading = form.formState.isSubmitting
  const onSubmit = async (values: z.infer<typeof CreateServerSchema>) => {
    try {
     const server= await axios.post('/api/servers',values)
      toast.success('The server was created!')
      form.reset()
      router.refresh()
      await actionRevalidatePath()
      onClose()
      router.push(`/servers/${server.data.id}`)
    } catch (e) {
      toast.error('Something went wrong!')
      console.log(e);
      
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
            className="w-full"
          >
            Create
          </Button>
        </footer>
        {children}
      </form>
    </Form>
  )
}
