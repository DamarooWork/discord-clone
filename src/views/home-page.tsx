import { Button } from '@/shared/ui'
import { Container } from '@/shared/components'
import { LanguageSelector, ThemeSelector } from '@/widgets'
import { getLocale, getTranslations } from 'next-intl/server'
import { UserButton } from '@clerk/nextjs'
import { initialProfile, prisma } from '@/shared/lib'
import { redirect } from '@/i18n/navigation'
import { InitialModal } from '@/shared/components/modals'

export async function HomePage() {
  const t = await getTranslations('home')
  const profile = await initialProfile()
  if (profile) {
    const firstServer = await prisma.server.findFirst({
      where: {
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
    })
    if (firstServer) {
      return redirect({
        href: `/servers/${firstServer.id}/`,
        locale: await getLocale(),
      })
    } else {
      return <InitialModal />
    }
  }
  return (
    <Container>
      <div className="text-4xl font-bold flex flex-col gap-4">
        {t('discord')}
        <Button variant="default">Click me</Button>
        <UserButton />
        <ThemeSelector />
        <LanguageSelector />
      </div>
    </Container>
  )
}
