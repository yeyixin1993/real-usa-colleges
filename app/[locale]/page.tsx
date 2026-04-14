import Link from 'next/link';

import { UsMap } from '@/components/map/us-map';
import { SectionHeading } from '@/components/shared/section-heading';
import { ScoreBadge } from '@/components/shared/score-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getCollections, getFeaturedSchools } from '@/lib/data';
import { getDictionary, getLocaleOrThrow } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = getLocaleOrThrow(localeParam);
  const dictionary = getDictionary(locale);
  const [featuredSchools, discoveryCollections] = await Promise.all([getFeaturedSchools(), getCollections()]);

  return (
    <main>
      <section className="section-space bg-hero-radial">
        <div className="container grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{dictionary.homepage.eyebrow}</p>
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 md:text-6xl">{dictionary.homepage.heroTitle}</h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">{dictionary.homepage.heroDescription}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={`/${locale}/schools`}>{dictionary.homepage.primaryCta}</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href={`/${locale}/methodology`}>{dictionary.homepage.secondaryCta}</Link>
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {dictionary.homepage.stats.map((stat) => (
                <Card key={stat} className="animate-float p-5">
                  <p className="text-sm leading-6 text-slate-600">{stat}</p>
                </Card>
              ))}
            </div>
          </div>
          <UsMap schools={featuredSchools} locale={locale} />
        </div>
      </section>

      <section className="section-space">
        <div className="container space-y-8">
          <SectionHeading title={dictionary.homepage.featuredTitle} description={dictionary.homepage.featuredDescription} />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featuredSchools.map((school) => (
              <Card key={school.slug} className="h-full transition hover:-translate-y-1 hover:shadow-glow">
                <CardContent className="flex h-full flex-col gap-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge>{school.schoolType}</Badge>
                      <h3 className="mt-3 text-xl font-semibold text-slate-950">{school.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {school.city}, {school.state}
                      </p>
                    </div>
                    <ScoreBadge score={school.scores.overall} compact />
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{school.summary[locale]}</p>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {school.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag}>{dictionary.tagLabels[tag]}</Badge>
                    ))}
                  </div>
                  <Button asChild variant="ghost" className="justify-start px-0 text-primary hover:bg-transparent">
                    <Link href={`/${locale}/schools/${school.slug}`}>{dictionary.common.learnMore}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-white/60">
        <div className="container space-y-8">
          <SectionHeading title={dictionary.homepage.collectionsTitle} description={dictionary.collections.description} />
          <div className="grid gap-5 lg:grid-cols-2">
            {discoveryCollections.map((collection) => (
              <Card key={collection.slug} className="h-full">
                <CardContent className="space-y-4 p-6">
                  <div className="space-y-2">
                    <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Collection</p>
                    <h3 className="text-2xl font-semibold text-slate-950">{collection.title[locale]}</h3>
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{collection.description[locale]}</p>
                  <p className="rounded-3xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">{collection.rationale[locale]}</p>
                  <Button asChild variant="secondary">
                    <Link href={`/${locale}/collections/${collection.slug}`}>{dictionary.common.learnMore}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="space-y-4 p-8">
              <SectionHeading title={dictionary.homepage.methodologyTitle} description={dictionary.homepage.methodologyDescription} />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl bg-slate-950 p-5 text-white">
                  <p className="text-sm text-white/70">Climate + daily life</p>
                  <p className="mt-2 text-3xl font-semibold">0–100</p>
                </div>
                <div className="rounded-3xl bg-slate-100 p-5 text-slate-900">
                  <p className="text-sm text-slate-500">Grade bands</p>
                  <p className="mt-2 text-3xl font-semibold">A to F</p>
                </div>
              </div>
              <Button asChild variant="secondary">
                <Link href={`/${locale}/methodology`}>{dictionary.common.viewMethodology}</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-4 p-8">
              <SectionHeading title={dictionary.homepage.trustTitle} description={dictionary.homepage.trustDescription} />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white/90 p-5">
                  <p className="text-sm font-medium text-slate-900">zh / en / ja</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Consistent information architecture across all three locales.</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white/90 p-5">
                  <p className="text-sm font-medium text-slate-900">Static-first delivery</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Designed for fast page loads, SEO stability, and future China-friendly delivery options.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
