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

interface Props {
  className?: string
  children?: React.ReactNode
}
export function CreateServerForm({ className, children }: Props) {
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(className, 'space-y-4')}
      >
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="uppercase text-xs font-bold text-primary-foreground dark:text-secondary/70">
                Server image
              </FormLabel>
              <FormControl>
                <FileUploader
                  endpoint="imageUploader"
                  value={field.value}
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
              <FormLabel className="uppercase text-xs font-bold text-primary-foreground dark:text-secondary/70">
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
