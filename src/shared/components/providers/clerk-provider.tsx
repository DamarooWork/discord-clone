import { ClerkProvider as ClerkProviderComponent } from '@clerk/nextjs'

export default function ClerkProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProviderComponent
      appearance={{
        cssLayerName: 'clerk',
        elements: {
          organizationSwitcherPopoverRootBox: {
            width: '100%',
            pointerEvents: 'auto',
          },
          userButtonPopoverRootBox: {
            width: '100%',
            pointerEvents: 'auto',
          },
        },
      }}
    >
      {children}
    </ClerkProviderComponent>
  )
}
