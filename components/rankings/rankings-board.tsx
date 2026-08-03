'use client';

import Link from 'next/link';
import { ArrowDownUp } from 'lucide-react';
import { useState } from 'react';

import { useUnitPreference } from '@/components/layout/unit-preference-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { rankFor, scoreForRanking, sortRankings, type RankedSchoolRow, type RankingKey, type ReversibleRankingKey } from '@/lib/rankings';
import { convertTemperature } from '@/lib/units';
import { formatNumber } from '@/lib/utils';
import type { Locale } from '@/types/school';

const copy = {
  en: {
    tabs: { cold: 'Cold ranking', village: 'Village ranking', white: 'White-share ranking', combined: 'Cold–village–white', warm: 'Inverse composite' },
    forward: { cold: 'Coldest', village: 'Most village-like', white: 'Highest White share' },
    reverse: { cold: 'Least cold', village: 'Least village-like', white: 'Lowest White share' },
    switchDirection: 'Reverse direction', rank: 'Rank', school: 'School', januaryLow: 'January avg low', snowfall: 'Annual snowfall', population: 'Population within 30 km', whiteShare: 'White undergraduates', score: 'Percentile score', combinedScore: 'Weighted score', entries: 'eligible schools', inverseNote: 'Exact reverse of the cold–village–white ranking',
  },
  zh: {
    tabs: { cold: '冷排名', village: '村排名', white: '白排名', combined: '冷村白排名', warm: '暖橙黄排名' },
    forward: { cold: '最冷排名', village: '最村排名', white: '最白排名' },
    reverse: { cold: '最不冷排名', village: '最不村排名', white: '最不白排名' },
    switchDirection: '切换正序 / 倒序', rank: '名次', school: '学校', januaryLow: '1 月月均最低', snowfall: '年降雪量', population: '方圆 30 km 内人口', whiteShare: '白人本科生占比', score: '百分位分', combinedScore: '加权分', entries: '所学校参与排名', inverseNote: '严格按冷村白排名倒序，不另加人口结构指标',
  },
  ja: {
    tabs: { cold: '寒さ順位', village: '小人口圏順位', white: '白人比率順位', combined: '寒さ・小人口圏・白人比率', warm: '加重順位の逆順' },
    forward: { cold: '最も寒い順', village: '最も小人口圏の順', white: '白人比率が高い順' },
    reverse: { cold: '最も寒くない順', village: '最も小人口圏でない順', white: '白人比率が低い順' },
    switchDirection: '順序を反転', rank: '順位', school: '学校', januaryLow: '1月平均最低', snowfall: '年間降雪量', population: '30 km圏内人口', whiteShare: '白人学部生比率', score: '百分位スコア', combinedScore: '加重スコア', entries: '校を順位付け', inverseNote: '加重順位を厳密に逆順表示',
  },
} satisfies Record<Locale, {
  tabs: Record<RankingKey, string>;
  forward: Record<ReversibleRankingKey, string>;
  reverse: Record<ReversibleRankingKey, string>;
  switchDirection: string;
  rank: string;
  school: string;
  januaryLow: string;
  snowfall: string;
  population: string;
  whiteShare: string;
  score: string;
  combinedScore: string;
  entries: string;
  inverseNote: string;
}>;

function isReversible(key: RankingKey): key is ReversibleRankingKey {
  return key === 'cold' || key === 'village' || key === 'white';
}

export function RankingsBoard({ rows, locale }: { rows: RankedSchoolRow[]; locale: Locale }) {
  const [active, setActive] = useState<RankingKey>('combined');
  const [reversed, setReversed] = useState<Record<ReversibleRankingKey, boolean>>({ cold: false, village: false, white: false });
  const { temperatureUnit } = useUnitPreference();
  const text = copy[locale];
  const activeReversed = isReversible(active) ? reversed[active] : false;
  const sorted = sortRankings(rows, active, activeReversed);
  const activeTitle = isReversible(active) ? (activeReversed ? text.reverse[active] : text.forward[active]) : text.tabs[active];

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {(Object.keys(text.tabs) as RankingKey[]).map((key) => {
          const winners = sortRankings(rows, key).filter((row) => rankFor(row, key) === 1).map((row) => row.name);
          const winnerLabel = winners.length > 2 ? `${winners.slice(0, 2).join(' / ')} +${winners.length - 2}` : winners.join(' / ');
          return (
            <button key={key} type="button" aria-pressed={active === key} onClick={() => setActive(key)} className={`rounded-3xl border p-5 text-left transition ${active === key ? 'border-primary bg-primary text-white shadow-lg' : 'border-slate-200 bg-white text-slate-900 hover:border-slate-400'}`}>
              <span className="text-sm font-semibold">{text.tabs[key]}</span>
              <span className={`mt-3 block text-lg font-semibold ${active === key ? 'text-white' : 'text-slate-950'}`}>#1 {winnerLabel || '—'}</span>
              <span className={`mt-1 block text-xs ${active === key ? 'text-white/75' : 'text-slate-500'}`}>{rows.length} {text.entries}</span>
            </button>
          );
        })}
      </div>

      <Card>
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>{activeTitle}</CardTitle>
            {active === 'warm' ? <p className="text-xs text-slate-500">{text.inverseNote}</p> : null}
          </div>
          <div className="flex items-center gap-2">
            {isReversible(active) ? (
              <Button
                type="button"
                variant="outline"
                aria-label={`${text.switchDirection}: ${activeTitle}`}
                onClick={() => setReversed((current) => ({ ...current, [active]: !current[active] }))}
              >
                <ArrowDownUp className="mr-2 h-4 w-4" />
                {activeReversed ? text.forward[active] : text.reverse[active]}
              </Button>
            ) : null}
            <Badge>{rows.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="min-w-[1080px] w-full text-sm">
            <thead>
              <tr className="border-y bg-slate-50 text-left text-slate-500">
                <th className="p-4 font-medium">{text.rank}</th>
                <th className="p-4 font-medium">{text.school}</th>
                <th className="p-4 font-medium">{text.januaryLow}</th>
                <th className="p-4 font-medium">{text.snowfall}</th>
                <th className="p-4 font-medium">{text.population}</th>
                <th className="p-4 font-medium">{text.whiteShare}</th>
                <th className="p-4 font-medium">{active === 'combined' || active === 'warm' ? text.combinedScore : text.score}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => (
                <tr key={row.slug} className="border-b border-slate-100 align-middle">
                  <td className="p-4 text-xl font-semibold text-slate-950">#{rankFor(row, active, activeReversed)}</td>
                  <td className="p-4">
                    <Link className="font-semibold text-primary underline-offset-4 hover:underline" href={`/${locale}/schools/${row.slug}`}>{row.name}</Link>
                    <p className="mt-1 text-xs text-slate-500">{row.city}, {row.stateCode}</p>
                  </td>
                  <td className={`p-4 ${active === 'cold' ? 'font-semibold text-blue-800' : 'text-slate-700'}`}>{Number(convertTemperature(row.januaryAverageLowF, temperatureUnit).toFixed(1))}°{temperatureUnit}</td>
                  <td className={`p-4 ${active === 'cold' ? 'font-semibold text-blue-800' : 'text-slate-700'}`}>{formatNumber(Math.round(row.annualSnowfallMm))} mm</td>
                  <td className={`p-4 ${active === 'village' ? 'font-semibold text-amber-800' : 'text-slate-700'}`}>{formatNumber(row.populationWithin30Km)}</td>
                  <td className={`p-4 ${active === 'white' ? 'font-semibold text-violet-800' : 'text-slate-700'}`}>{row.whiteUndergraduateShare}%</td>
                  <td className="p-4 font-semibold text-slate-950">{scoreForRanking(row, active, activeReversed).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
