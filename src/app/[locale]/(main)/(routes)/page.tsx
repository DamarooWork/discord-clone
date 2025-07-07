import { Button } from '@/shared/ui'
import { Container } from '@/shared/components'
import { LanguageSelector, ThemeSelector } from '@/widgets'
import { getTranslations } from 'next-intl/server'

export default async function Home() {
  const t = await getTranslations('home')

  return (
    <Container>
      <div className="text-4xl font-bold flex flex-col gap-4">
        <div>{t('discord')}</div>
        <Button variant="ghost">Click me</Button>
        <ThemeSelector />
        <LanguageSelector />
      </div>
    </Container>
  )
}
