import { Button } from '@/shared/ui'
import { Container } from '@/shared/components'
import { LanguageSelector, ThemeSelector } from '@/widgets'
import { getTranslations } from 'next-intl/server'
import { UserButton } from '@clerk/nextjs'
import { prisma } from '@/shared/lib/prisma'

export default async function Home() {
  const t = await getTranslations('home')

  const profiles = await prisma.profile.findMany()
  console.log(profiles)
  return (
    <Container>
      <div className="text-4xl font-bold flex flex-col gap-4">
        <div>{t('discord')}</div>
        <Button variant="ghost">Click me</Button>
        <UserButton />
        <ThemeSelector />
        <LanguageSelector />
      </div>
    </Container>
  )
}
