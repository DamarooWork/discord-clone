import { LanguageSelector } from '@/widgets';
import { getTranslations } from 'next-intl/server';

export default async function Home() {
  const t = await getTranslations('home')

  return (
    <div className="text-4xl font-bold text-red-500">
      <div>{t('discord')}</div>
      <LanguageSelector />
    </div>
  );
}
