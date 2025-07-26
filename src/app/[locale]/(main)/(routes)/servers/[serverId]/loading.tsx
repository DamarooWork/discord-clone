import { Skeleton } from '@/shared/ui'

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="w-full h-screen flex flex-col">
      <Skeleton className="h-12 w-full  rounded-none border-b-2" />
      <Skeleton className="flex-1 w-full  rounded-none" />
    </div>
  )
}
