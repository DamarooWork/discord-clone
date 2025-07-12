interface Props {
  children: React.ReactNode
}
export default function AuthLayout({ children }: Props) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      {children}
    </main>
  )
}
