'use client';

import { useUnitPreference } from '@/components/layout/unit-preference-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { convertTemperature } from '@/lib/units';
import type { Locale, MonthlyClimate, PublicClimateProfile } from '@/types/school';

const labels = {
  en: {
    title: 'Monthly temperatures: normals and 2021–2025 observed extremes',
    description: 'Monthly normal averages and the lowest/maximum daily observations recorded in each calendar month.',
    month: 'Month', averageMin: 'Avg min', actualMin: 'Lowest min', averageHigh: 'Avg high', actualMax: 'Highest max', note: 'Basis',
  },
  zh: {
    title: '每月气温：气候常值与 2021–2025 实际观测极值',
    description: '同时列出月均最低/最高温，以及每个自然月在 2021–2025 年观测到的最低与最高气温。',
    month: '月份', averageMin: '月均最低', actualMin: '最低极值', averageHigh: '月均最高', actualMax: '最高极值', note: '数据口径',
  },
  ja: {
    title: '月別気温：平年値と2021–2025年の実測極値',
    description: '月平均の最低・最高気温と、各月に観測された最低・最高気温を併記します。',
    month: '月', averageMin: '平均最低', actualMin: '最低極値', averageHigh: '平均最高', actualMax: '最高極値', note: 'データ基準',
  },
} satisfies Record<Locale, Record<string, string>>;

function displayTemperature(valueC: number | null, unit: 'C' | 'F') {
  if (valueC === null) return '—';
  const value = unit === 'C' ? valueC : (valueC * 9) / 5 + 32;
  return `${Number(value.toFixed(1))}°${unit}`;
}

function displayNormalTemperature(valueF: number, unit: 'C' | 'F') {
  return `${Number(convertTemperature(valueF, unit).toFixed(1))}°${unit}`;
}

export function RecentExtremesTable({ data, normals, normalPeriod, locale }: {
  data: PublicClimateProfile['recentObserved'];
  normals: MonthlyClimate[];
  normalPeriod: string;
  locale: Locale;
}) {
  const { temperatureUnit } = useUnitPreference();
  const text = labels[locale];
  const monthFormatter = new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : locale === 'ja' ? 'ja-JP' : 'en-US', { month: 'short', timeZone: 'UTC' });
  const basis = locale === 'zh'
    ? `月均值：NOAA ${normalPeriod} 常值；极值：2021–2025 实测`
    : locale === 'ja'
      ? `平均：NOAA ${normalPeriod}年平年値；極値：2021–2025年実測`
      : `Averages: NOAA ${normalPeriod} normals; extremes: 2021–2025 observations`;

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle>{text.title}</CardTitle>
        <p className="text-sm leading-6 text-slate-600">{text.description}</p>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="p-3 font-medium">{text.month}</th>
              <th className="p-3 font-medium">{text.averageMin}</th>
              <th className="p-3 font-medium">{text.actualMin}</th>
              <th className="p-3 font-medium">{text.averageHigh}</th>
              <th className="p-3 font-medium">{text.actualMax}</th>
              <th className="min-w-72 p-3 font-medium">{text.note}</th>
            </tr>
          </thead>
          <tbody>
            {normals.map((normal, monthIndex) => {
              const month = data?.monthly[monthIndex];
              return (
                <tr key={normal.month} className="border-b border-slate-100">
                  <td className="p-3 font-medium text-slate-900">{monthFormatter.format(new Date(Date.UTC(2025, monthIndex, 1)))}</td>
                  <td className="p-3 text-blue-700">{displayNormalTemperature(normal.lowF, temperatureUnit)}</td>
                  <td className="p-3 font-medium text-blue-900">{displayTemperature(month?.actualMinC ?? null, temperatureUnit)}</td>
                  <td className="p-3 text-rose-700">{displayNormalTemperature(normal.highF, temperatureUnit)}</td>
                  <td className="p-3 font-medium text-rose-900">{displayTemperature(month?.actualMaxC ?? null, temperatureUnit)}</td>
                  <td className="p-3 text-xs leading-5 text-slate-500">{basis}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
