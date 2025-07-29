'use client'
import qs from 'query-string'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
} from '@/shared/ui'
import z from 'zod'
import { FileUploader } from '@/widgets'
import { toast } from 'sonner'
import { useRouter } from '@/i18n/navigation'
import axios from 'axios'
import { useModalStore } from '@/shared/store'
import { MessageFileSchema } from './message-file-schema'
import { useState } from 'react'
import { MessageFileType } from '@prisma/client'


export function MessageFileForm() {
  const [fileType, setFileType] = useState<MessageFileType>('IMAGE')
  const [fileName, setFileName] = useState('')
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(MessageFileSchema),
    defaultValues: {
      fileUrl: '',
    },
  })
  const { onClose, data } = useModalStore()
  const { apiUrl, query } = data
  const isLoading = form.formState.isSubmitting
  const changeFileType = (fileType: MessageFileType) => {
    setFileType(fileType)
  }
  const onSubmit = async (values: z.infer<typeof MessageFileSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || '',
        query,
      })
      
      await axios.post(url, {
        ...values,
        content: values.fileUrl,
        fileType,
        fileName,
      })
      form.reset()
      router.refresh()
      onClose()
    } catch (e) {
      toast.error('Something went wrong!', {
        position: 'top-right',
      })
      console.log(e)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fileUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message file</FormLabel>
              <FormControl>
                <FileUploader
                  endpoint="messageFile"
                  value={field.value}
                  isLoading={isLoading}
                  onChange={field.onChange}
                  changeFileType={changeFileType}
                  setFileName={setFileName}
                  fileName={fileName}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <footer className="pb-4 flex justify-end">
          <Button variant="primary" type="submit" disabled={isLoading}>
            Send
          </Button>
        </footer>
      </form>
    </Form>
  )
}
