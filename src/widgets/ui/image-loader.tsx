import { cn } from "@/shared/lib/utils"
import { Skeleton } from "@/shared/ui"
interface Props {
  className?: string
}
export  function  ImageLoader({className}:Props){

  return (
    <Skeleton className={cn(className, "")} />
  )
}