'use client'
import { ChatType } from '@/shared/types'
import { ChatInputForm } from '@/shared/components/forms'

interface ChatInputProps {
  apiUrl: string
  query: Record<string, any>
  name: string
  type: ChatType
}


export function ChatInput({ apiUrl, query, name, type }: ChatInputProps) {
  return <ChatInputForm />
}
