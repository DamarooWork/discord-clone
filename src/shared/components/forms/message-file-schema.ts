export {zodResolver} from '@hookform/resolvers/zod'
import { z } from 'zod'

export const MessageFileSchema = z.object({
  fileUrl: z.string().min(1, { message: 'Attachment is required' }),
})