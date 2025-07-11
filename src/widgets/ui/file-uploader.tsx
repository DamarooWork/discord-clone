'use client'
import { cn, UploadDropzone } from '@/shared/lib/utils'
import { Button } from '@/shared/ui'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'
import { ImageLoader } from '@/widgets'
import { useState } from 'react'
import { actionDeleteUploadThingFile } from '@/shared/lib/actions'

interface Props {
  className?: string
  endpoint: 'messageFile' | 'imageUploader'
  value: string
  onChange: (url?: string) => void
}

const buttonClass = `group relative flex justify-center items-center h-10 w-32 cursor-pointer  overflow-hidden rounded-md text-primary  after:transition-[width] after:duration-500 focus-within:ring-2 focus-within:ring-red-600 focus-within:ring-offset-2 disabled:pointer-events-none data-[state=disabled]:cursor-not-allowed data-[state=readying]:cursor-not-allowed data-[state=disabled]:bg-red-400 data-[state=ready]:bg-red-200 bg-transparent outline-none border-[1px] border-red-300 rounded-lg p-2 data-[state=readying]:bg-red-400 data-[state=uploading]:bg-red-400 after:absolute after:left-0 after:h-full after:w-[var(--progress-width)] after:content-[''] data-[state=uploading]:after:bg-red-600`
export function FileUploader({ className, endpoint, value, onChange }: Props) {
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
  if (value && fileType !== 'pdf') {
    return (
      <section
        className={cn(className, 'flex justify-center items-center gap-4')}
      >
        <div className="size-40 relative group">
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
            priority
            onLoad={onLoadingComplete}
          />
          <Button
            className="absolute opacity-0 group-hover:opacity-75 inset-0 w-full h-full  rounded-full text-xl will-change-[opacity] transition-all "
            variant={'primary'}
            onClick={changeImage}
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
            // button: buttonClass,
            // allowedContent: 'text-primary',
            // label: 'text-primary hover:text-red-600',
            // uploadIcon: 'text-primary',
          }
        }
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res[0].ufsUrl)
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`)
        }}
      />
    </section>
  )
}
