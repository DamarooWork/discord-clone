import { Button } from '@/shared/ui'
import { Container } from '@/shared/components'
import { LanguageSelector, ThemeSelector } from '@/widgets'
import { getTranslations } from 'next-intl/server'
import { UserButton } from '@clerk/nextjs'
import { initialProfile } from '@/shared/lib/initial-profile'
import { prisma } from '@/shared/lib/prisma'
import { redirect } from '@/i18n/navigation'
import { Locale } from 'next-intl'
import { InitialModal } from '@/shared/components/modals'

export async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
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
      const { locale } = await params
      return redirect({ href: '/servers/' + firstServer.id, locale })
    } else {
      return <InitialModal/>
    }
  }
  return (
    <Container>
      <main className="text-4xl font-bold flex flex-col gap-4">
        {t('discord')}
        <Button variant="default">Click me</Button>
        <UserButton />
        <ThemeSelector />
        <LanguageSelector />
      </main>
    </Container>
  )
}
