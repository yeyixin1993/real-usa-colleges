import type { Metadata } from 'next';
import Link from 'next/link';

import { SectionHeading } from '@/components/shared/section-heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getCollections, getSchoolsForCollection } from '@/lib/data';
import { getDictionary, getLocaleOrThrow } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = getLocaleOrThrow(localeParam);
  const dictionary = getDictionary(locale);

  return {
    title: dictionary.collections.title,
    description: dictionary.collections.description,
  };
}

export default async function CollectionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = getLocaleOrThrow(localeParam);
  const dictionary = getDictionary(locale);
  const collections = await getCollections();
  const previewCounts = await Promise.all(collections.map((collection) => getSchoolsForCollection(collection.slug)));

  return (
    <main className="container section-space space-y-8">
      <SectionHeading title={dictionary.collections.title} description={dictionary.collections.description} />
      <div className="grid gap-5 lg:grid-cols-2">
        {collections.map((collection, index) => (
          <Card key={collection.slug}>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Collection</p>
                <h2 className="text-2xl font-semibold text-slate-950">{collection.title[locale]}</h2>
              </div>
              <p className="text-sm leading-7 text-slate-600">{collection.description[locale]}</p>
              <p className="rounded-3xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">{collection.rationale[locale]}</p>
              <p className="text-sm text-slate-500">{previewCounts[index].length} schools</p>
              <Button asChild variant="secondary">
                <Link href={`/${locale}/collections/${collection.slug}`}>{dictionary.common.learnMore}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
