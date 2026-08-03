import type { Metadata } from 'next';
import Link from 'next/link';

import { SectionHeading } from '@/components/shared/section-heading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getSchoolComparisons } from '@/lib/data';
import { getDictionary, getLocaleOrThrow } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

function percent(value?: number | null) {
  return value == null ? '—' : `${value}%`;
}

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
        <CardContent className="overflow-x-auto p-6">
          <table className="min-w-full text-sm">
            <thead><tr className="border-b text-left text-slate-500"><th className="p-3">School</th><th className="p-3">Undergraduates</th><th className="p-3">Asian</th><th className="p-3">Hispanic / Latino</th><th className="p-3">Black</th><th className="p-3">White</th><th className="p-3">Nonresident</th></tr></thead>
            <tbody>{schools.map((school) => <tr key={school.slug} className="border-b border-slate-100"><td className="p-3 font-medium text-slate-950">{school.name}</td><td className="p-3">{school.verification?.undergraduateEnrollment?.toLocaleString() ?? '—'}</td><td className="p-3">{percent(school.demographics.campus.asian)}</td><td className="p-3">{percent(school.demographics.campus.hispanicLatino)}</td><td className="p-3">{percent(school.demographics.campus.black)}</td><td className="p-3">{percent(school.demographics.campus.white)}</td><td className="p-3">{percent(school.demographics.campus.internationalStudents)}</td></tr>)}</tbody>
          </table>
        </CardContent>
      </Card>
      <section className="grid gap-5 lg:grid-cols-3">
        {schools.map((school) => (
          <Card key={school.slug}>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{school.sector}</Badge>
                    <Badge>UNITID {school.verification?.unitId}</Badge>
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-950">{school.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {school.city}, {school.state}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-6 text-slate-600">Institution identity, location, and undergraduate demographics are verified. Original contextual values remain available on the profile and are labeled until verified.</p>
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
          <p className="text-sm leading-7 text-slate-600">Source: U.S. Department of Education College Scorecard, Most Recent Cohorts Institution-Level Data, May 19, 2025.</p>
          <p className="text-sm leading-7 text-slate-600">Percentages describe undergraduate enrollment. Missing source values are shown as an em dash and are not estimated.</p>
        </CardContent>
      </Card>
    </main>
  );
}
