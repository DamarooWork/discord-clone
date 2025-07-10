import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CreateServerSchema } from './create-server-schema'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
} from '@/shared/ui'
import z from 'zod'

interface Props {
  className?: string
}
export function CreateServerForm({ className }: Props) {
  const form = useForm({
    resolver: zodResolver(CreateServerSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof CreateServerSchema>) => {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex justify-center items-center">
          TODO: Image upload
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="uppercase text-xs font-bold text-primary-foreground dark:text-secondary/70">
                Server name
              </FormLabel>
              <FormControl>
                <Input  className=' dark:bg-zinc-300/50' disabled={isLoading} {...field} placeholder="for example: My Server" />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
