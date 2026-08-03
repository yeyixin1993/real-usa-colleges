import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { UsMap } from '@/components/map/us-map';
import { AccessibilityTable } from '@/components/school/accessibility-table';
import { AirportMetrics } from '@/components/school/airport-metrics';
import { ClimateSummaryMetrics } from '@/components/school/climate-summary-metrics';
import { DemographicsPanel } from '@/components/school/demographics-panel';
import { MobilitySection } from '@/components/school/mobility-section';
import { RecentExtremesTable } from '@/components/school/recent-extremes-table';
import { SectionHeading } from '@/components/shared/section-heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSchoolBySlug, getSchools } from '@/lib/data';
import { getDictionary, getLocaleOrThrow } from '@/lib/i18n';
import { getPublicMobilityProfileForSlug } from '@/lib/server/mobility';
import { formatNumber } from '@/lib/utils';
import type { CategoryKey, DataSourceRef, Locale, NullableAccessibilityPoint, ScoreKey } from '@/types/school';
import { locales } from '@/types/school';

export const dynamic = 'force-dynamic';

const copy = {
  en: {
    verified: 'Verified federal record',
    description: 'Institution identity, location, and undergraduate demographics verified against the U.S. Department of Education College Scorecard.',
    enrollment: 'Undergraduate enrollment',
    coordinates: 'Federal campus coordinates',
    climateDescription: 'The table combines official NOAA 1991–2020 monthly normals with actual daily extremes observed during 2021–2025.',
    recentMissing: 'Recent NOAA observations did not meet the 90% monthly coverage requirement; no actual extreme is published for the missing month.',
    recentMethod: 'Highest observed daily TMAX and lowest observed daily TMIN in each calendar month; quality-flagged observations are excluded and at least 90% daily coverage is required.',
    station: 'Selected NOAA station',
    stationDistance: 'Campus-to-station distance',
    normalPeriod: 'Climate normal period',
    climateDetails: 'Precipitation, snowfall, and humidity',
    climateDetailsMethod: 'Precipitation and snowfall are sums of 12 NOAA 1991–2020 monthly normals from the nearest station with a complete series for that metric. Humidity is NASA POWER RH2M for the campus coordinate (1991–2020); it is MERRA-2 gridded model/assimilation data, not an on-campus sensor. Bands: Dry <50%, Balanced 50–65%, Humid >65%.',
    convenienceDescription: 'Original nearby-place, routing, and availability data remains visible while each source is verified.',
    airportDescription: 'Original airport and travel-time data remains visible while its source is verified.',
    scores: 'Scores',
    scoresDescription: 'Original scores remain visible while their source inputs and calculation are verified.',
    mobility: 'Mobility and Uber',
    mobilityDescription: 'Original Uber, Uber Eats, transit, walkability, and mobility values remain visible while sources are verified.',
    verifiedLabel: '✓ Verified',
    unverifiedLabel: '⚠ Unverified',
    unverifiedNote: 'Original data is displayed for continuity. A supporting source has not yet been attached.',
    source: 'Source',
    checked: 'checked',
    sourceCoverage: 'Source and coverage',
    sourceNote: 'Green Verified labels include a source users can open. Amber Unverified labels identify original values still awaiting review. NOAA values are tied to the named weather station, not inferred campus readings.',
    officialWebsite: 'Official website',
  },
  zh: {
    verified: '已核实的联邦记录',
    description: '学校身份、位置和本科生人口数据均已通过美国教育部 College Scorecard 核实。',
    enrollment: '本科生人数',
    coordinates: '联邦校园坐标',
    climateDescription: '表格同时列出 NOAA 官方 1991–2020 月度气候常值，以及 2021–2025 每日实测数据中的月度极值。',
    recentMissing: '近期 NOAA 观测未达到每月 90% 的覆盖要求；缺失月份不发布实测极值。',
    recentMethod: '按自然月取观测到的最高日最高温（TMAX）和最低日最低温（TMIN）；排除带质量标记的数据，且逐日覆盖率必须达到 90%。',
    station: '选用的 NOAA 气象站',
    stationDistance: '校园至气象站距离',
    normalPeriod: '气候常值时段',
    climateDetails: '降水、降雪与湿度',
    climateDetailsMethod: '降水量和降雪量分别汇总最近且该指标 12 个月完整的 NOAA 1991–2020 月常值；页面列出所用气象站。湿度采用校园坐标处的 NASA POWER RH2M 1991–2020 数据，它来自 MERRA-2 网格化模型/同化数据，并非校园传感器。分档：低于 50% 偏干，50–65% 适中，高于 65% 偏湿。',
    convenienceDescription: '在逐项核实来源期间，原有附近地点、路线与可用性数据继续显示。',
    airportDescription: '在核实来源期间，原有机场与行程时间数据继续显示。',
    scores: '评分',
    scoresDescription: '在核实来源输入与计算方法期间，原有评分继续显示。',
    mobility: '出行与 Uber',
    mobilityDescription: '在核实来源期间，原有 Uber、Uber Eats、公共交通、步行与出行评分继续显示。',
    verifiedLabel: '✓ 已核实',
    unverifiedLabel: '⚠ 尚未核实',
    unverifiedNote: '为保持数据连续性，当前显示原有数据；尚未附上支持来源。',
    source: '来源',
    checked: '核实日期',
    sourceCoverage: '来源与覆盖范围',
    sourceNote: '绿色“已核实”标签附有可打开的来源；琥珀色“尚未核实”标签表示原有数据仍待审核。NOAA 数值对应页面列出的气象站，不是推算的校园读数。',
    officialWebsite: '学校官网',
  },
  ja: {
    verified: '検証済み連邦記録',
    description: '学校情報、所在地、学部生人口構成を米国教育省 College Scorecard で検証済みです。',
    enrollment: '学部生数',
    coordinates: '連邦データのキャンパス座標',
    climateDescription: '表には NOAA の公式月別平年値（1991–2020年）と、2021–2025年の日別観測から得た月別極値を併記します。',
    recentMissing: '最近の NOAA 観測が月90%の網羅率を満たさない場合、その月の実測極値は掲載しません。',
    recentMethod: '各暦月の観測日最高気温（TMAX）の最高値と日最低気温（TMIN）の最低値です。品質フラグ付き観測を除外し、日別網羅率90%以上を条件とします。',
    station: '選択した NOAA 観測所',
    stationDistance: 'キャンパスから観測所まで',
    normalPeriod: '気候平年期間',
    climateDetails: '降水量、降雪量、湿度',
    climateDetailsMethod: '降水量と降雪量は、各指標について12か月そろう最寄りの NOAA 観測所の1991–2020年平年値を合計しています。湿度はキャンパス座標の NASA POWER RH2M（1991–2020年）で、MERRA-2 の格子化モデル・同化データであり、キャンパス内センサー値ではありません。',
    convenienceDescription: '出典を順次検証しながら、元の周辺施設・経路・利用可否データを表示します。',
    airportDescription: '出典を検証しながら、元の空港・所要時間データを表示します。',
    scores: 'スコア',
    scoresDescription: '入力元と計算方法を検証しながら、元のスコアを表示します。',
    mobility: '移動・Uber',
    mobilityDescription: '出典を検証しながら、元の Uber、Uber Eats、交通、徒歩、移動スコアを表示します。',
    verifiedLabel: '✓ 検証済み',
    unverifiedLabel: '⚠ 未検証',
    unverifiedNote: 'データの継続性のため元の値を表示していますが、裏付ける出典はまだ登録されていません。',
    source: '出典',
    checked: '確認日',
    sourceCoverage: '出典と対象範囲',
    sourceNote: '緑の「検証済み」には確認用リンクがあり、琥珀色の「未検証」は確認待ちの元データです。NOAA の値は表示された観測所に紐づき、キャンパスの推定値ではありません。',
    officialWebsite: '公式サイト',
  },
} satisfies Record<Locale, Record<string, string>>;

const scoreKeys: ScoreKey[] = ['overall', 'climate', 'demographics', 'food', 'life', 'airport'];

function VerificationStatus({ source, verifiedLabel, unverifiedLabel, unverifiedNote, sourceLabel, checked }: {
  source?: DataSourceRef;
  verifiedLabel: string;
  unverifiedLabel: string;
  unverifiedNote: string;
  sourceLabel: string;
  checked: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs leading-6 text-slate-600">
      <Badge className={source ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-800'}>
        {source ? verifiedLabel : unverifiedLabel}
      </Badge>
      {source ? (
        <span>
          {sourceLabel}: <a className="font-medium text-primary underline underline-offset-2" href={source.url} target="_blank" rel="noreferrer">{source.label}</a>
          {source.checkedAt ? ` · ${checked} ${source.checkedAt}` : ''}
        </span>
      ) : <span>{unverifiedNote}</span>}
    </div>
  );
}

export async function generateStaticParams() {
  const schools = await getSchools();
  return locales.flatMap((locale) => schools.map((school) => ({ locale, slug: school.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = getLocaleOrThrow(localeParam);
  const school = await getSchoolBySlug(slug);
  if (!school) return {};
  return { title: school.name, description: copy[locale].description };
}

export default async function SchoolDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: localeParam, slug } = await params;
  const locale = getLocaleOrThrow(localeParam);
  const dictionary = getDictionary(locale);
  const [school, mobilityProfile] = await Promise.all([
    getSchoolBySlug(slug),
    getPublicMobilityProfileForSlug(slug),
  ]);

  if (!school?.verification) notFound();

  const text = copy[locale];
  const statusCopy = {
    verifiedLabel: text.verifiedLabel,
    unverifiedLabel: text.unverifiedLabel,
    unverifiedNote: text.unverifiedNote,
    sourceLabel: text.source,
    checked: text.checked,
  };
  const verification = school.verification;
  const foodItems = Object.entries(school.foodConvenience) as Array<[CategoryKey, NullableAccessibilityPoint]>;
  const lifeItems = Object.entries(school.lifeConvenience) as Array<[CategoryKey, NullableAccessibilityPoint]>;
  const climate = school.climate;
  const avgHighF = climate ? climate.monthly.reduce((sum, month) => sum + month.highF, 0) / climate.monthly.length : null;
  const avgLowF = climate ? climate.monthly.reduce((sum, month) => sum + month.lowF, 0) / climate.monthly.length : null;
  const scoreLabels: Record<ScoreKey, string> = {
    overall: dictionary.metrics.overallScore,
    climate: dictionary.metrics.climateScore,
    demographics: dictionary.metrics.demographicsScore,
    food: dictionary.metrics.foodScore,
    life: dictionary.metrics.lifeScore,
    airport: dictionary.metrics.airportScore,
  };
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: school.name,
    url: verification.website,
    address: { '@type': 'PostalAddress', addressLocality: school.city, addressRegion: school.stateCode, addressCountry: 'US' },
    geo: { '@type': 'GeoCoordinates', latitude: school.coordinates.lat, longitude: school.coordinates.lng },
  };

  return (
    <main className="container section-space space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Card>
        <CardContent className="space-y-6 p-8">
          <div className="flex flex-wrap gap-2"><Badge>{school.sector}</Badge><Badge>{text.verified}</Badge></div>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">{school.name}</h1>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-600">{school.city}, {school.state}</p>
            <p className="max-w-3xl text-lg leading-8 text-slate-700">{text.description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {verification.website ? <Button asChild><a href={verification.website} rel="noreferrer">{text.officialWebsite}</a></Button> : null}
            <Button asChild variant="secondary"><Link href={`/${locale}/schools`}>{dictionary.common.exploreSchools}</Link></Button>
          </div>
        </CardContent>
      </Card>

      <UsMap schools={[school]} locale={locale} />

      <section className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-6"><p className="text-sm text-slate-500">UNITID</p><p className="mt-2 text-2xl font-semibold text-slate-950">{verification.unitId}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-slate-500">{text.enrollment}</p><p className="mt-2 text-2xl font-semibold text-slate-950">{verification.undergraduateEnrollment == null ? '—' : formatNumber(verification.undergraduateEnrollment)}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-slate-500">{text.coordinates}</p><p className="mt-2 text-lg font-semibold text-slate-950">{school.coordinates.lat.toFixed(6)}, {school.coordinates.lng.toFixed(6)}</p></CardContent></Card>
      </section>

      <section className="space-y-5">
        <SectionHeading title={dictionary.detail.climate} description={text.climateDescription} />
        {climate && avgHighF !== null && avgLowF !== null ? (
          <div className="space-y-4">
            <RecentExtremesTable data={climate.recentObserved} normals={climate.monthly} normalPeriod={climate.source.normalPeriod} locale={locale} />
            <div className="space-y-3">
              {climate.recentObserved ? <VerificationStatus {...statusCopy} source={climate.recentObserved.source} /> : <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">{text.recentMissing}</p>}
              <p className="text-xs leading-6 text-slate-500">{text.recentMethod}</p>
            </div>
            <Card>
              <CardContent className="space-y-5 p-6">
                <ClimateSummaryMetrics avgHighF={avgHighF} avgLowF={avgLowF} annualPrecipitationMm={climate.annualPrecipitationMm} annualSnowfallMm={climate.annualSnowfallMm} annualMeanRelativeHumidityPercent={climate.annualMeanRelativeHumidityPercent} humidityBand={climate.humidityBand} details={climate.details} dictionary={dictionary} />
                <div className="space-y-2 border-t border-slate-200 pt-4">
                  <p className="text-sm font-medium text-slate-900">{text.climateDetails}</p>
                  <p className="text-xs leading-6 text-slate-500">{text.climateDetailsMethod}</p>
                </div>
                <div className="space-y-2 border-t border-slate-200 pt-4 text-sm leading-7 text-slate-600">
                  <VerificationStatus {...statusCopy} source={climate.source} />
                  <p><span className="font-medium text-slate-900">{text.station}:</span> {climate.station.name} ({climate.station.id})</p>
                  <p><span className="font-medium text-slate-900">{text.stationDistance}:</span> {climate.station.distanceMiles.toFixed(1)} mi</p>
                  <p><span className="font-medium text-slate-900">{text.normalPeriod}:</span> {climate.source.normalPeriod}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : <VerificationStatus {...statusCopy} />}
      </section>

      <section className="space-y-5">
        <SectionHeading title={dictionary.detail.campusDemographics} description={text.description} />
        <DemographicsPanel title={dictionary.detail.campusDemographics} data={school.demographics.campus} dictionary={dictionary} />
      </section>

      <section className="space-y-5">
        <SectionHeading title={`${dictionary.detail.food} / ${dictionary.detail.life}`} description={text.convenienceDescription} />
        <VerificationStatus {...statusCopy} source={school.fieldSources.convenience} />
        <div className="grid gap-4 xl:grid-cols-2">
          <AccessibilityTable title={dictionary.detail.food} items={foodItems} dictionary={dictionary} />
          <AccessibilityTable title={dictionary.detail.life} items={lifeItems} dictionary={dictionary} />
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading title={dictionary.detail.airport} description={text.airportDescription} />
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle>{school.airportAccess.airportName ?? '—'}</CardTitle>
            {school.airportAccess.metricSources?.airport ? <a className="text-xs font-medium text-emerald-700 underline underline-offset-2" href={school.airportAccess.metricSources.airport.url} target="_blank" rel="noreferrer">✓ {school.airportAccess.metricSources.airport.label}</a> : null}
          </CardHeader>
          <CardContent className="space-y-5">
            <VerificationStatus {...statusCopy} source={school.fieldSources.airport} />
            <AirportMetrics distanceMiles={school.airportAccess.distanceMiles} driveMinutes={school.airportAccess.driveMinutes} transitMinutes={school.airportAccess.publicTransitMinutes} metricSources={school.airportAccess.metricSources} routeLinks={school.airportAccess.routeLinks} dictionary={dictionary} />
            {school.airportAccess.practicalTravelSummary ? <p className="text-sm leading-7 text-slate-600">{school.airportAccess.practicalTravelSummary[locale]}</p> : null}
          </CardContent>
        </Card>
      </section>

      {mobilityProfile ? <MobilitySection profile={mobilityProfile} locale={locale} /> : (
        <section className="space-y-5">
          <SectionHeading title={text.mobility} description={text.mobilityDescription} />
          <Card><CardContent className="grid gap-3 p-6 sm:grid-cols-2 lg:grid-cols-4">
            {['Uber', 'Uber Eats', dictionary.metrics.transitTime, 'Mobility Score'].map((label) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-semibold">—</p></div>
            ))}
            <div className="sm:col-span-2 lg:col-span-4"><VerificationStatus {...statusCopy} /></div>
          </CardContent></Card>
        </section>
      )}

      <section className="space-y-5">
        <SectionHeading title={text.scores} description={text.scoresDescription} />
        <Card><CardContent className="grid gap-3 p-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-3"><VerificationStatus {...statusCopy} source={school.fieldSources.scores} /></div>
          {scoreKeys.map((key) => (
            <div key={key} className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">{scoreLabels[key]}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{school.scores[key] == null ? '—' : school.scores[key]}</p>
            </div>
          ))}
        </CardContent></Card>
      </section>

      <section className="space-y-5" id="source-notes">
        <SectionHeading title={text.sourceCoverage} description={text.sourceNote} />
        <Card><CardContent className="space-y-4 p-8 text-sm leading-7 text-slate-600">
          <div><p className="font-medium text-slate-950">{verification.source.label}</p><p>{verification.source.release}</p><a className="font-medium text-primary" href={verification.source.url}>College Scorecard data catalog</a></div>
          {climate ? <div><p className="font-medium text-slate-950">{climate.source.label}</p><p>{climate.source.release}</p><a className="font-medium text-primary" href={climate.source.url}>NOAA U.S. Climate Normals</a></div> : null}
          {climate?.recentObserved ? <div><p className="font-medium text-slate-950">{climate.recentObserved.source.label}</p><p>{climate.recentObserved.source.release} · {climate.recentObserved.source.observationPeriod}</p><a className="font-medium text-primary" href={climate.recentObserved.source.url}>NOAA GHCN-Daily</a></div> : null}
          <p>{text.sourceNote}</p>
        </CardContent></Card>
      </section>
    </main>
  );
}
