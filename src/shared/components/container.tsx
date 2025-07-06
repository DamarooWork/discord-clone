import { cn } from '@/shared/lib/utils'

interface Props {
  className?: string
  children: React.ReactNode
}

export const Container = ({ className, children }: Props) => {
  return (
    <section className={cn('mx-auto max-w-[1536px] px-4 lg:px-10 py-2 lg:py-5', className)}>
      {children}
    </section>
  )
}
