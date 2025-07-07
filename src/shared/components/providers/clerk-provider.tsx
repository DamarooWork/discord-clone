import { ClerkProvider as ClerkProviderComponent } from '@clerk/nextjs'

export default function ClerkProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClerkProviderComponent>{children}</ClerkProviderComponent>
}
