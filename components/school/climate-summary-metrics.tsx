'use client';

import { useUnitPreference } from '@/components/layout/unit-preference-provider';
import { convertTemperature } from '@/lib/units';
import type { Dictionary } from '@/types/dictionary';

export function ClimateSummaryMetrics({
  avgHighF,
  avgLowF,
  annualPrecipitationIn,
  annualSnowfallIn,
  humidityBand,
  dictionary,
}: {
  avgHighF: number;
  avgLowF: number;
  annualPrecipitationIn: number;
  annualSnowfallIn: number;
  humidityBand: string;
  dictionary: Dictionary;
}) {
  const { temperatureUnit } = useUnitPreference();

  const high = Math.round(convertTemperature(avgHighF, temperatureUnit));
  const low = Math.round(convertTemperature(avgLowF, temperatureUnit));

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-3xl bg-slate-50 p-4">
        <p className="text-sm text-slate-500">{dictionary.metrics.avgMonthlyHigh}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-950">
          {high}°{temperatureUnit}
        </p>
      </div>
      <div className="rounded-3xl bg-slate-50 p-4">
        <p className="text-sm text-slate-500">{dictionary.metrics.avgMonthlyLow}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-950">
          {low}°{temperatureUnit}
        </p>
      </div>
      <div className="rounded-3xl bg-slate-50 p-4">
        <p className="text-sm text-slate-500">{dictionary.metrics.annualPrecipitation}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-950">{annualPrecipitationIn} in</p>
      </div>
      <div className="rounded-3xl bg-slate-50 p-4">
        <p className="text-sm text-slate-500">{dictionary.metrics.annualSnowfall}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-950">{annualSnowfallIn} in</p>
      </div>
      <div className="rounded-3xl bg-slate-50 p-4 sm:col-span-2">
        <p className="text-sm text-slate-500">{dictionary.metrics.humidityBand}</p>
        <p className="mt-2 text-lg font-semibold text-slate-950">{humidityBand}</p>
      </div>
    </div>
  );
}
