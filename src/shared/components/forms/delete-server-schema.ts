export {zodResolver} from '@hookform/resolvers/zod'
import { z } from 'zod'

export const DeleteServerSchema = z.object({
  name: z.string().min(1, { message: 'Server name is required' }),
})