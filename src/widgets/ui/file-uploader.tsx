'use client'
import { cn, UploadDropzone } from '@/shared/lib/utils'
import { Button } from '@/shared/ui'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'
import { ImageLoader } from '@/widgets'
import React, { useState } from 'react'
import { actionDeleteUploadThingFile } from '@/shared/lib/actions'
import { toast } from 'sonner'
import { Eye, FileIcon, X } from 'lucide-react'
import { Link } from '@/i18n/navigation'

interface Props {
  className?: string
  endpoint: 'messageFile' | 'imageUploader'
  value: string
  onChange: (url?: string) => void
  isLoading?: boolean
}

export function FileUploader({
  className,
  endpoint,
  value,
  onChange,
  isLoading = false,
}: Props) {
  const buttonClass = `group relative flex justify-center items-center h-10 w-32 cursor-pointer mt-2 overflow-hidden rounded-md text-background dark:text-foreground  after:transition-[width] after:duration-500 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 disabled:pointer-events-none data-[state=disabled]:cursor-not-allowed data-[state=readying]:cursor-not-allowed data-[state=disabled]:bg-indigo-400 data-[state=ready]:bg-main bg-transparent outline-none border-[1px] border-indigo-300 rounded-lg p-2 data-[state=readying]:bg-indigo-800 data-[state=uploading]:bg-indigo-400 after:absolute after:left-0 after:h-full after:w-[var(--progress-width)] after:content-[''] data-[state=uploading]:after:bg-indigo-600`
  const [isImageLoaded, setImageLoaded] = useState(false)
  const [pdfName, setPdfName] = useState('')
  const onLoadingComplete = () => {
    setImageLoaded(true)
  }
  const changeImage = async () => {
    if (!isImageLoaded) {
      return
    }
    onChange('')
    if (value) {
      await actionDeleteUploadThingFile(value)
    }
    setImageLoaded(false)
  }
  const onError = (event: React.SyntheticEvent) => {
    toast.error(`Упс! ${event.type}`)
    changeImage()
  }
  if (value && !pdfName) {
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
            sizes="160px"
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
  if (value && pdfName) {
    return (
      <section
        className={cn(className, 'flex justify-between items-center gap-4 mt-4')}
      >
        <FileIcon className="size-12 fill-indigo-200 stroke-indigo-400" />
        <Link
          href={value}
          target="_blank"
          className="block truncate max-w-[200px] sm:max-w-[320px] "
          rel="noreferrer noopener"
        >
          {pdfName}
        </Link>
        <X
          className="size-12 text-rose-500  cursor-pointer "
          onClick={changeImage}
        >
          Change file
        </X>
      </section>
    )
  }
  return (
    <section className={className}>
      <UploadDropzone
        config={{ cn: twMerge, mode: 'auto' }}
        className={'cursor-pointer'}
        appearance={{
          container: 'group/dropzone border-foreground',
          button: buttonClass,
          allowedContent: 'text-foreground',
          label:
            'mt-0 text-foreground group-hover/dropzone:underline hover:text-foreground',
          uploadIcon: 'text-foreground',
        }}
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          if (res[0].type.endsWith('pdf')) {
            setPdfName(res[0].name)
          } else {
            setPdfName('')
          }
          onChange(res[0].ufsUrl)
        }}
        onUploadError={(error: Error) => {
          toast.error(`${error.message}`)
          console.log(error)
        }}
      />
    </section>
  )
}
