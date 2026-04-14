import type { Metadata } from 'next';
import Link from 'next/link';

import { ScoreComparisonChart } from '@/components/charts/score-comparison-chart';
import { SectionHeading } from '@/components/shared/section-heading';
import { ScoreBadge } from '@/components/shared/score-badge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getSchoolComparisons } from '@/lib/data';
import { getDictionary, getLocaleOrThrow } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = getLocaleOrThrow(localeParam);
  const dictionary = getDictionary(locale);

  return {
    title: dictionary.compare.title,
    description: dictionary.compare.description,
  };
}

export default async function ComparePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ schools?: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = getLocaleOrThrow(localeParam);
  const dictionary = getDictionary(locale);
  const { schools: slugParam } = await searchParams;
  const slugs = slugParam?.split(',').filter(Boolean) ?? ['ucla', 'northeastern-university', 'rice-university'];
  const schools = await getSchoolComparisons(slugs);

  return (
    <main className="container section-space space-y-8">
      <SectionHeading title={dictionary.compare.title} description={dictionary.compare.description} />
      <Card>
        <CardContent className="p-6">
          <ScoreComparisonChart schools={schools} />
        </CardContent>
      </Card>
      <section className="grid gap-5 lg:grid-cols-3">
        {schools.map((school) => (
          <Card key={school.slug}>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{school.schoolType}</Badge>
                    <Badge>{school.sector}</Badge>
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-950">{school.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {school.city}, {school.state}
                  </p>
                </div>
                <ScoreBadge score={school.scores.overall} compact />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-slate-500">Climate</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{school.scores.climate}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-slate-500">Airport</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{school.scores.airport}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-slate-500">Food</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{school.scores.food}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-slate-500">Life</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{school.scores.life}</p>
                </div>
              </div>
              <p className="text-sm leading-6 text-slate-600">{school.summary[locale]}</p>
              <Link href={`/${locale}/schools/${school.slug}`} className="text-sm font-medium text-primary">
                {dictionary.common.learnMore}
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>
      <Card>
        <CardContent className="space-y-3 p-8">
          <h2 className="text-xl font-semibold text-slate-950">{dictionary.compare.notesTitle}</h2>
          <p className="text-sm leading-7 text-slate-600">Scores summarize daily-life practicality and should be read alongside the underlying metrics on each school page.</p>
          <p className="text-sm leading-7 text-slate-600">Public transit time is intentionally visible because car ownership is not assumed for international undergraduates.</p>
        </CardContent>
      </Card>
    </main>
  );
}
