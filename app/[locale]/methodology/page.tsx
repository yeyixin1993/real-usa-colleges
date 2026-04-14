import type { Metadata } from 'next';

import { SectionHeading } from '@/components/shared/section-heading';
import { Card, CardContent } from '@/components/ui/card';
import { getDictionary, getLocaleOrThrow } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = getLocaleOrThrow(localeParam);
  const dictionary = getDictionary(locale);

  return {
    title: dictionary.methodology.title,
    description: dictionary.methodology.description,
  };
}

export default async function MethodologyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = getLocaleOrThrow(localeParam);
  const dictionary = getDictionary(locale);

  return (
    <main className="container section-space space-y-8">
      <SectionHeading title={dictionary.methodology.title} description={dictionary.methodology.description} />
      <section className="grid gap-5 lg:grid-cols-3">
        {[
          {
            title: 'Climate',
            body: 'Climate scoring favors practical livability: temperature range, humidity, snow burden, and the real effort required to move around campus and town across the year.',
          },
          {
            title: 'Demographics context',
            body: 'Demographics are shown descriptively, never as a value judgment. The score is framed as context richness, combining campus and surrounding-area information.',
          },
          {
            title: 'Convenience + airport access',
            body: 'Food, life, and airport scores account for both distance and car-free practicality. Public transit time meaningfully changes the final outcome.',
          },
        ].map((item) => (
          <Card key={item.title}>
            <CardContent className="space-y-3 p-6">
              <h2 className="text-xl font-semibold text-slate-950">{item.title}</h2>
              <p className="text-sm leading-7 text-slate-600">{item.body}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      <Card>
        <CardContent className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold text-slate-950">{dictionary.methodology.pillarsTitle}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">
              <p className="font-medium text-slate-900">Scoring scale</p>
              <p className="mt-2">A: 85–100, B: 70–84, C: 55–69, D: 40–54, F: below 40.</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">
              <p className="font-medium text-slate-900">Interpretation rule</p>
              <p className="mt-2">No score should replace raw metrics. Every profile keeps narrative notes and travel-time data visible.</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold text-slate-950">{dictionary.methodology.limitationsTitle}</h2>
          <p className="text-sm leading-7 text-slate-600">Launch data is currently mock and intended to validate product structure. Future production data can connect to PostgreSQL with PostGIS for proximity and radius queries.</p>
          <p className="text-sm leading-7 text-slate-600">Rankings are included as one field among many and are intentionally not treated as a substitute for fit, climate, or day-to-day practicality.</p>
        </CardContent>
      </Card>
      <Card id="data-transparency">
        <CardContent className="space-y-4 p-8">
          <h2 className="text-2xl font-semibold text-slate-950">{dictionary.methodology.deliveryTitle}</h2>
          <p className="text-sm leading-7 text-slate-600">The site is designed to stay mostly static-friendly, avoid Google-dependent architecture assumptions, and remain adaptable for future delivery patterns that work better in mainland China.</p>
          <p className="text-sm leading-7 text-slate-600">Internationalized routing uses dictionary-based messages so editorial updates can scale cleanly across Chinese, English, and Japanese.</p>
        </CardContent>
      </Card>
    </main>
  );
}
