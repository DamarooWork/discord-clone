'use client'
import { cn, UploadDropzone } from '@/shared/lib/utils'
import { Button } from '@/shared/ui'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'
import { ImageLoader } from '@/widgets'
import React, { useState } from 'react'
import { actionDeleteUploadThingFile } from '@/shared/lib/actions'
import { toast } from 'sonner'

interface Props {
  className?: string
  endpoint: 'messageFile' | 'imageUploader'
  value: string
  onChange: (url?: string) => void
  isLoading?: boolean
}

 
 
export function FileUploader({ className, endpoint, value, onChange, isLoading=false }: Props) {
 const buttonClass = `group relative flex justify-center items-center h-10 w-32 cursor-pointer mt-2 overflow-hidden rounded-md text-foreground  after:transition-[width] after:duration-500 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 disabled:pointer-events-none data-[state=disabled]:cursor-not-allowed data-[state=readying]:cursor-not-allowed data-[state=disabled]:bg-indigo-400 data-[state=ready]:bg-main bg-transparent outline-none border-[1px] border-indigo-300 rounded-lg p-2 data-[state=readying]:bg-indigo-800 data-[state=uploading]:bg-indigo-400 after:absolute after:left-0 after:h-full after:w-[var(--progress-width)] after:content-[''] data-[state=uploading]:after:bg-indigo-600`
  const [isImageLoaded, setImageLoaded] = useState(false)
  const fileType = value?.split('.').pop()
  const onLoadingComplete = () => {
    setImageLoaded(true)
  }
  const changeImage = async () => {
    onChange('')
    if (value) {
      await actionDeleteUploadThingFile(value)
    } 
    setImageLoaded(false)
  }
  const onError = (event: React.SyntheticEvent) => {
    toast.error(`Упс! ${event.type}`)
    onChange('')
  }
  if (value && fileType !== 'pdf') {
    return (
      <section
        className={cn(className, 'flex justify-center items-center gap-4')}
      >
        <div className="size-40 relative group/img ring-4 rounded-full ring-main shadow-lg shadow-main">
          {!isImageLoaded && (
            <ImageLoader className="size-40 rounded-full absolute inset-0" />
          )}
          <Image
            src={value}
            alt="Uploaded image"
            className={cn(
              'rounded-full object-cover',
              isImageLoaded && 'opacity-100'
            )}
            fill
            sizes='160px'
            priority
            onLoad={onLoadingComplete}
            onError={onError}
          />
          <Button
            className="absolute opacity-0 disabled:opacity-0 group-hover/img:opacity-75 inset-0 w-full h-full  rounded-full text-xl will-change-[opacity] transition-all "
            variant={'primary'}
            onClick={changeImage}
            disabled={isLoading}
          >
            Change image
          </Button>
        </div>
      </section>
    )
  }
  return (
    <section className={className}>
      <UploadDropzone
        config={{ cn: twMerge }}
        className={'cursor-pointer'}
        appearance={
          {
            container: 'group/dropzone',
            button: buttonClass,
            allowedContent: 'text-main',
            label: 'mt-0 text-main group-hover/dropzone:underline hover:text-main',
            uploadIcon: 'text-main',
          }
        }
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res[0].ufsUrl)
        }}
        onUploadError={(error: Error) => {
          toast.error(`Упс! ${error.message}`)
        }}
      />
    </section>
  )
}
