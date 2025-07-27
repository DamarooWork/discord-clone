import * as z from 'zod'

export const ChatInputSchema = z.object({
  content: z.string().min(1),
})