export { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export const EditChannelSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Channel name is required' })
    .refine((name) => name !== 'General', {
      message: ' Channel name cannot be "General"',
    }),
})
