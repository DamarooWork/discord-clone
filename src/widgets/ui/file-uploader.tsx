'use client'
import { UploadDropzone } from '@/shared/lib/utils'
import { twMerge } from 'tailwind-merge'

interface Props {
  className?: string
  endpoint: 'messageFile' | 'imageUploader'
  value: string
  onChange: (url?: string) => void
}
export function FileUploader({ className, endpoint, value, onChange }: Props) {
  const buttonClass = `group relative flex justify-center items-center h-10 w-32 cursor-pointer  overflow-hidden rounded-md text-primary  after:transition-[width] after:duration-500 focus-within:ring-2 focus-within:ring-red-600 focus-within:ring-offset-2 disabled:pointer-events-none data-[state=disabled]:cursor-not-allowed data-[state=readying]:cursor-not-allowed data-[state=disabled]:bg-red-400 data-[state=ready]:bg-red-200 bg-transparent outline-none border-[1px] border-red-300 rounded-lg p-2 data-[state=readying]:bg-red-400 data-[state=uploading]:bg-red-400 after:absolute after:left-0 after:h-full after:w-[var(--progress-width)] after:content-[''] data-[state=uploading]:after:bg-red-600`
  return (
    <section className="  ">
      <UploadDropzone
        config={{ cn: twMerge }}
        className={' cursor-pointer'}
        appearance={{
          // button: buttonClass,
          // allowedContent: 'text-primary',
          // label: 'text-primary hover:text-red-600',
          // uploadIcon: 'text-primary',
        }}
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
