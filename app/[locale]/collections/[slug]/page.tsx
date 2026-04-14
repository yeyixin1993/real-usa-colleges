import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ScoreBadge } from '@/components/shared/score-badge';
import { SectionHeading } from '@/components/shared/section-heading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getCollectionBySlug, getSchoolsForCollection } from '@/lib/data';
import { getDictionary, getLocaleOrThrow } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = getLocaleOrThrow(localeParam);
  const collection = await getCollectionBySlug(slug);

  if (!collection) return {};

  return {
    title: collection.title[locale],
    description: collection.description[locale],
  };
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = getLocaleOrThrow(localeParam);
  const dictionary = getDictionary(locale);
  const collection = await getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const schools = await getSchoolsForCollection(slug);

  return (
    <main className="container section-space space-y-8">
      <SectionHeading title={collection.title[locale]} description={collection.description[locale]} />
      <Card>
        <CardContent className="p-8 text-sm leading-7 text-slate-600">
          <p className="font-medium text-slate-900">{dictionary.collections.rationale}</p>
          <p className="mt-2">{collection.rationale[locale]}</p>
        </CardContent>
      </Card>
      <section className="space-y-5">
        <h2 className="text-2xl font-semibold text-slate-950">{dictionary.collections.includedSchools}</h2>
        <div className="grid gap-5 lg:grid-cols-2">
          {schools.map((school) => (
            <Link key={school.slug} href={`/${locale}/schools/${school.slug}`}>
              <Card className="h-full transition hover:-translate-y-1 hover:shadow-glow">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <Badge>{school.schoolType}</Badge>
                        <Badge>{school.sector}</Badge>
                      </div>
                      <h3 className="mt-3 text-xl font-semibold text-slate-950">{school.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {school.city}, {school.state}
                      </p>
                    </div>
                    <ScoreBadge score={school.scores.overall} grade={school.scoreGrades?.overall} compact />
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{school.summary[locale]}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
