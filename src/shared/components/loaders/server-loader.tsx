import { Skeleton } from "@/shared/ui"

export  function  ServerLoader(){

  return (
    <div className="w-18 h-screen flex flex-col">
      <Skeleton className="h-12 w-full  rounded-none border-b-2" />
      <Skeleton className="flex-1 w-full  rounded-none" />
    </div>
  )
}