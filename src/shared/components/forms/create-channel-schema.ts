export { zodResolver } from '@hookform/resolvers/zod'
import { ChannelType } from '@prisma/client'
import { z } from 'zod'

export const CreateChannelSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Channgel name is required' })
    .refine((name) => name !== 'General', {
      message: ' Channel name cannot be "general"',
    }),
  type: z.nativeEnum(ChannelType),
})
