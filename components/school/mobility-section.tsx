import { Card, CardContent } from '@/components/ui/card';
import type { MobilityProfile } from '@/types/mobility';
import type { Locale } from '@/types/school';

function getLabels(locale: Locale) {
  if (locale === 'zh') {
    return {
      title: 'Mobility（出行与无车可行性）',
      score: 'Mobility Score',
      uberTier: 'Uber Tier',
      dayWait: 'Uber 日间等待',
      nightWait: 'Uber 夜间等待',
      uberEats: 'Uber Eats 覆盖分',
      transit: '公共交通分',
      walkability: '步行可达分',
      carDependency: '汽车依赖友好分',
      summary: '客观说明',
    };
  }

  if (locale === 'ja') {
    return {
      title: 'Mobility（移動実用性）',
      score: 'Mobility Score',
      uberTier: 'Uber Tier',
      dayWait: 'Uber 昼間待機時間',
      nightWait: 'Uber 夜間待機時間',
      uberEats: 'Uber Eats カバレッジ',
      transit: '公共交通スコア',
      walkability: '徒歩利便性スコア',
      carDependency: '車依存低減スコア',
      summary: '要約',
    };
  }

  return {
    title: 'Mobility',
    score: 'Mobility Score',
    uberTier: 'Uber Tier',
    dayWait: 'Typical Uber wait (day)',
    nightWait: 'Typical Uber wait (night)',
    uberEats: 'Uber Eats coverage',
    transit: 'Public transit score',
    walkability: 'Walkability score',
    carDependency: 'Car dependency score',
    summary: 'Summary',
  };
}

function tierBadge(tier: MobilityProfile['uber_tier']) {
  if (tier === 'tier_1') return '🟢 Tier 1 — Uber-native campus';
  if (tier === 'tier_2') return '🟡 Tier 2 — Conditional Uber';
  return '🔴 Tier 3 — Fake Uber coverage';
}

export function MobilitySection({ profile, locale }: { profile: MobilityProfile; locale: Locale }) {
  const labels = getLabels(locale);

  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-semibold text-slate-950">{labels.title}</h2>

      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl bg-slate-950 p-6 text-white">
              <p className="text-sm text-white/70">{labels.score}</p>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-5xl font-semibold">{profile.mobility_score}</span>
                <span className="rounded-full bg-white/15 px-3 py-1 text-lg font-semibold">{profile.mobility_grade}</span>
              </div>
              <p className="mt-4 text-sm text-white/80">{tierBadge(profile.uber_tier)}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">{labels.dayWait}</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">{profile.uber_wait_time_day} min</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">{labels.nightWait}</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">{profile.uber_wait_time_night} min</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">{labels.uberEats}</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">{profile.uber_eats_score}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">{labels.transit}</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">{profile.public_transit_score}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">{labels.walkability}</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">{profile.walkability_score}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">{labels.carDependency}</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">{profile.car_dependency_score}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                {tag}
              </span>
            ))}
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
            <p className="mb-1 font-medium text-slate-900">{labels.summary}</p>
            <p>{profile.summary}</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
