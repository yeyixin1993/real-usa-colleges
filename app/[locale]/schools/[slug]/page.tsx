import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { TemperatureChart } from '@/components/charts/temperature-chart';
import { AccessibilityTable } from '@/components/school/accessibility-table';
import { AirportMetrics } from '@/components/school/airport-metrics';
import { ClimateSummaryMetrics } from '@/components/school/climate-summary-metrics';
import { DemographicsPanel } from '@/components/school/demographics-panel';
import { MobilitySection } from '@/components/school/mobility-section';
import { SectionHeading } from '@/components/shared/section-heading';
import { ScoreBadge } from '@/components/shared/score-badge';
import { ScoreCard } from '@/components/shared/score-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getCollectionBySlug, getLocalizedText, getSchoolBySlug, getSchools } from '@/lib/data';
import { getGrade } from '@/lib/grades';
import { getDictionary, getLocaleOrThrow } from '@/lib/i18n';
import { getMobilityProfileForSchool } from '@/lib/server/mobility';
import type { AccessibilityPoint, CategoryKey, Locale } from '@/types/school';
import { locales } from '@/types/school';

export const dynamic = 'force-dynamic';

function average(values: number[]) {
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export async function generateStaticParams() {
  const schools = await getSchools();
  return locales.flatMap((locale) => schools.map((school) => ({ locale, slug: school.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = getLocaleOrThrow(localeParam);
  const school = await getSchoolBySlug(slug);

  if (!school) {
    return {};
  }

  return {
    title: school.name,
    description: school.summary[locale],
    openGraph: {
      title: school.name,
      description: school.summary[locale],
      type: 'article',
    },
  };
}

function AirportAccessLabel(level: 'easy' | 'moderate' | 'inconvenient', locale: Locale) {
  const labels = {
    en: { easy: 'Relatively easy', moderate: 'Moderate', inconvenient: 'Inconvenient' },
    zh: { easy: '相对轻松', moderate: '中等', inconvenient: '不太方便' },
    ja: { easy: '比較的容易', moderate: '中程度', inconvenient: '不便' },
  };

  return labels[locale][level];
}

export default async function SchoolDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = getLocaleOrThrow(localeParam);
  const dictionary = getDictionary(locale);
  const school = await getSchoolBySlug(slug);

  if (!school) {
    notFound();
  }

  const foodItems = Object.entries(school.foodConvenience) as Array<[CategoryKey, AccessibilityPoint]>;
  const lifeItems = Object.entries(school.lifeConvenience) as Array<[CategoryKey, AccessibilityPoint]>;
  const mobility = await getMobilityProfileForSchool(school);
  const avgHigh = average(school.climate.monthly.map((entry) => entry.highF));
  const avgLow = average(school.climate.monthly.map((entry) => entry.lowF));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: school.name,
    address: {
      '@type': 'PostalAddress',
      addressLocality: school.city,
      addressRegion: school.stateCode,
      addressCountry: 'US',
    },
    description: school.summary[locale],
  };

  return (
    <main className="container section-space space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden bg-white text-slate-950">
          <CardContent className="space-y-6 p-8">
            <div className="flex flex-wrap gap-2">
              <Badge className="border-slate-300 bg-slate-100 text-slate-800">{school.schoolType}</Badge>
              <Badge className="border-slate-300 bg-slate-100 text-slate-800">{school.sector}</Badge>
              <Badge className="border-slate-300 bg-slate-100 text-slate-800">{school.rankingBand}</Badge>
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{school.name}</h1>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-600">
                {school.city}, {school.state}
              </p>
              <p className="max-w-3xl text-lg leading-8 text-slate-700">{school.summary[locale]}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <ScoreBadge score={school.scores.overall} grade={school.scoreGrades?.overall} label={dictionary.metrics.overallScore} />
              <Button asChild variant="secondary">
                <Link href={`/${locale}/compare?schools=${school.slug},ucla,northeastern-university`}>{dictionary.common.compare}</Link>
              </Button>
              <Button variant="ghost" className="border border-slate-300 text-slate-800 hover:bg-slate-100 hover:text-slate-900">
                {dictionary.common.save}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid h-full gap-4 p-8 sm:grid-cols-2">
            <div className="rounded-[28px] bg-slate-100 p-5">
              <p className="text-sm text-slate-500">{dictionary.metrics.climateScore}</p>
              <p className="mt-3 text-4xl font-semibold text-slate-950">{school.scores.climate}</p>
              <p className="mt-1 text-sm text-slate-500">{school.scoreGrades?.climate ?? getGrade(school.scores.climate)}</p>
            </div>
            <div className="rounded-[28px] bg-slate-100 p-5">
              <p className="text-sm text-slate-500">{dictionary.metrics.airportScore}</p>
              <p className="mt-3 text-4xl font-semibold text-slate-950">{school.scores.airport}</p>
              <p className="mt-1 text-sm text-slate-500">{school.scoreGrades?.airport ?? getGrade(school.scores.airport)}</p>
            </div>
            <div className="rounded-[28px] bg-slate-50 p-5 sm:col-span-2">
              <p className="text-sm text-slate-500">{dictionary.common.overview}</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{school.methodologyNote[locale]}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-5">
        <SectionHeading title={dictionary.detail.quickScores} description={school.methodologyNote[locale]} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <ScoreCard title={dictionary.metrics.climateScore} description={getLocalizedText(locale, school.climate.seasonalLifestyleSummary)} score={school.scores.climate} grade={school.scoreGrades?.climate} />
          <ScoreCard title={dictionary.metrics.demographicsScore} description={dictionary.detail.contextRichness} score={school.scores.demographics} grade={school.scoreGrades?.demographics} />
          <ScoreCard title={dictionary.metrics.foodScore} description={getLocalizedText(locale, school.foodConvenience.asian_grocery.note ?? school.summary)} score={school.scores.food} grade={school.scoreGrades?.food} />
          <ScoreCard title={dictionary.metrics.lifeScore} description={school.lifeConvenience.hospital.name} score={school.scores.life} grade={school.scoreGrades?.life} />
          <ScoreCard title={dictionary.metrics.airportScore} description={school.airportAccess.airportName} score={school.scores.airport} grade={school.scoreGrades?.airport} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <SectionHeading title={dictionary.detail.climate} description={dictionary.detail.climateNarrative} />
              <ScoreBadge score={school.scores.climate} grade={school.scoreGrades?.climate} />
            </div>
            <TemperatureChart data={school.climate.monthly} />
          </CardContent>
        </Card>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
          <Card>
            <CardContent className="space-y-4 p-6">
              <h3 className="text-lg font-semibold text-slate-950">Summary metrics</h3>
              <ClimateSummaryMetrics
                avgHighF={avgHigh}
                avgLowF={avgLow}
                annualPrecipitationIn={school.climate.annualPrecipitationIn}
                annualSnowfallIn={school.climate.annualSnowfallIn}
                humidityBand={school.climate.humidityBand}
                dictionary={dictionary}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-4 p-6">
              <h3 className="text-lg font-semibold text-slate-950">{dictionary.detail.seasonalSummary}</h3>
              <div className="space-y-4 text-sm leading-7 text-slate-600">
                <div>
                  <p className="font-medium text-slate-900">{dictionary.metrics.summerHeat}</p>
                  <p>{school.climate.summerHeatIntensity[locale]}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">{dictionary.metrics.winterSeverity}</p>
                  <p>{school.climate.winterSeverity[locale]}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">{dictionary.metrics.sunshine}</p>
                  <p>{school.climate.sunshineSummary[locale]}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">{dictionary.metrics.severeWeather}</p>
                  <p>{school.climate.severeWeatherNotes[locale]}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4 text-slate-700">{school.climate.seasonalLifestyleSummary[locale]}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <SectionHeading title={dictionary.detail.demographics} description={school.demographics.note[locale]} />
          <ScoreBadge score={school.scores.demographics} grade={school.scoreGrades?.demographics} />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <DemographicsPanel title={dictionary.detail.campusDemographics} data={school.demographics.campus} dictionary={dictionary} />
          <DemographicsPanel title={dictionary.detail.areaDemographics} data={school.demographics.area30mi} dictionary={dictionary} />
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <SectionHeading title={dictionary.detail.food} description={school.summary[locale]} />
          <ScoreBadge score={school.scores.food} grade={school.scoreGrades?.food} />
        </div>
        <AccessibilityTable title={dictionary.detail.food} items={foodItems} dictionary={dictionary} />
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <SectionHeading title={dictionary.detail.life} description={school.methodologyNote[locale]} />
          <ScoreBadge score={school.scores.life} grade={school.scoreGrades?.life} />
        </div>
        <AccessibilityTable title={dictionary.detail.life} items={lifeItems} dictionary={dictionary} />
      </section>

      <MobilitySection profile={mobility} locale={locale} />

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="bg-gradient-to-br from-slate-50 to-white">
          <CardContent className="space-y-4 p-8">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{dictionary.detail.airport}</p>
            <h2 className="text-3xl font-semibold text-slate-950">{school.airportAccess.airportName}</h2>
            <AirportMetrics
              distanceMiles={school.airportAccess.distanceMiles}
              driveMinutes={school.airportAccess.driveMinutes}
              transitMinutes={school.airportAccess.publicTransitMinutes}
              dictionary={dictionary}
            />
            <ScoreBadge score={school.scores.airport} grade={school.scoreGrades?.airport} label={AirportAccessLabel(school.airportAccess.accessLevel, locale)} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-5 p-8">
            <div>
              <p className="text-sm font-medium text-slate-500">{dictionary.metrics.practicalAccess}</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{school.airportAccess.connectivitySummary[locale]}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{dictionary.detail.airportSummary}</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{school.airportAccess.practicalTravelSummary[locale]}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-5" id="source-notes">
        <SectionHeading title={dictionary.detail.sources} description={school.methodologyNote[locale]} />
        <Card>
          <CardContent className="space-y-4 p-8 text-sm leading-7 text-slate-600">
            <p>{school.methodologyNote[locale]}</p>
            <p>{dictionary.common.staticDataNote}</p>
            <p>{school.summary[locale]}</p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
