import { getTranslations } from 'next-intl/server';

export default async function Home() {
  const t = await getTranslations('Home')

  return (
    <div className="text-4xl font-bold text-red-500">{t('discord')}</div>
  );
}
