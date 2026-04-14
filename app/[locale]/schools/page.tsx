import type { Metadata } from 'next';

import { DirectoryClient } from '@/components/directory/directory-client';
import { SectionHeading } from '@/components/shared/section-heading';
import { getSchools } from '@/lib/data';
import { getDictionary, getLocaleOrThrow } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = getLocaleOrThrow(localeParam);
  const dictionary = getDictionary(locale);

  return {
    title: dictionary.directory.title,
    description: dictionary.directory.description,
  };
}

export default async function SchoolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = getLocaleOrThrow(localeParam);
  const dictionary = getDictionary(locale);
  const schools = await getSchools();

  return (
    <main className="container section-space space-y-8">
      <SectionHeading title={dictionary.directory.title} description={dictionary.directory.description} />
      <DirectoryClient locale={locale} dictionary={dictionary} schools={schools} />
    </main>
  );
}
