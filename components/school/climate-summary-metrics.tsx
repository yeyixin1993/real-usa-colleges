'use client';

import { useUnitPreference } from '@/components/layout/unit-preference-provider';
import { convertTemperature } from '@/lib/units';
import type { Dictionary } from '@/types/dictionary';
import type { ClimateMetricEvidence, HumidityBand } from '@/types/school';

function MetricEvidence({ evidence }: { evidence: ClimateMetricEvidence | null }) {
  if (!evidence) return null;
  return (
    <div className="mt-2 space-y-1 text-xs leading-5">
      <a className="font-medium text-emerald-700 underline underline-offset-2" href={evidence.source.url} target="_blank" rel="noreferrer">✓ {evidence.source.label}</a>
      {evidence.station ? <p className="text-slate-500">{evidence.station.name} ({evidence.station.id}) · {evidence.station.distanceMiles.toFixed(1)} mi</p> : null}
    </div>
  );
}

export function ClimateSummaryMetrics({
  avgHighF,
  avgLowF,
  annualPrecipitationMm,
  annualSnowfallMm,
  annualMeanRelativeHumidityPercent,
  humidityBand,
  details,
  dictionary,
}: {
  avgHighF: number;
  avgLowF: number;
  annualPrecipitationMm: number | null;
  annualSnowfallMm: number | null;
  annualMeanRelativeHumidityPercent: number | null;
  humidityBand: HumidityBand | null;
  details: {
    precipitation: ClimateMetricEvidence | null;
    snowfall: ClimateMetricEvidence | null;
    humidity: ClimateMetricEvidence | null;
  };
  dictionary: Dictionary;
}) {
  const { temperatureUnit } = useUnitPreference();

  const high = Math.round(convertTemperature(avgHighF, temperatureUnit));
  const low = Math.round(convertTemperature(avgLowF, temperatureUnit));
  const humidityBandLabel = humidityBand === 'Dry'
    ? dictionary.metrics.humidityDry
    : humidityBand === 'Balanced'
      ? dictionary.metrics.humidityBalanced
      : humidityBand === 'Humid'
        ? dictionary.metrics.humidityHumid
        : null;

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
        <p className="mt-2 text-2xl font-semibold text-slate-950">{annualPrecipitationMm == null ? '—' : `${Math.round(annualPrecipitationMm)} mm`}</p>
        <MetricEvidence evidence={details.precipitation} />
      </div>
      <div className="rounded-3xl bg-slate-50 p-4">
        <p className="text-sm text-slate-500">{dictionary.metrics.annualSnowfall}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-950">{annualSnowfallMm == null ? '—' : `${Math.round(annualSnowfallMm)} mm`}</p>
        <MetricEvidence evidence={details.snowfall} />
      </div>
      <div className="rounded-3xl bg-slate-50 p-4 sm:col-span-2">
        <p className="text-sm text-slate-500">{dictionary.metrics.annualMeanRelativeHumidity}</p>
        <p className="mt-2 text-lg font-semibold text-slate-950">{annualMeanRelativeHumidityPercent == null ? '—' : `${annualMeanRelativeHumidityPercent.toFixed(1)}%${humidityBandLabel ? ` · ${humidityBandLabel}` : ''}`}</p>
        <MetricEvidence evidence={details.humidity} />
      </div>
    </div>
  );
}
