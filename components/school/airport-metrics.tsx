'use client';

import { useUnitPreference } from '@/components/layout/unit-preference-provider';
import { formatDistance } from '@/lib/units';
import { formatMinutes } from '@/lib/utils';
import type { Dictionary } from '@/types/dictionary';
import type { AirportMetricKey, AirportRouteLinks, DataSourceRef } from '@/types/school';

function MetricSource({ source }: { source?: DataSourceRef }) {
  if (!source) return null;
  return <a className="mt-1 block text-xs font-medium text-emerald-700 underline underline-offset-2" href={source.url} target="_blank" rel="noreferrer">✓ {source.label}</a>;
}

export function AirportMetrics({
  distanceMiles,
  driveMinutes,
  transitMinutes,
  metricSources,
  routeLinks,
  dictionary,
}: {
  distanceMiles: number | null;
  driveMinutes: number | null;
  transitMinutes: number | null;
  metricSources?: Partial<Record<AirportMetricKey, DataSourceRef>>;
  routeLinks?: AirportRouteLinks;
  dictionary: Dictionary;
}) {
  const { distanceUnit } = useUnitPreference();

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div>
        <p className="text-sm text-slate-500">{dictionary.metrics.distance}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-950">{distanceMiles == null ? '—' : formatDistance(distanceMiles, distanceUnit)}</p>
        <MetricSource source={metricSources?.distance} />
      </div>
      <div>
        <p className="text-sm text-slate-500">{dictionary.metrics.drivingTime}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-950">{formatMinutes(driveMinutes)}</p>
        <MetricSource source={metricSources?.drive} />
      </div>
      <div>
        <p className="text-sm text-slate-500">{dictionary.metrics.transitTime}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-950">{formatMinutes(transitMinutes)}</p>
        <MetricSource source={metricSources?.transit} />
      </div>
      {routeLinks ? (
        <div className="space-y-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 sm:col-span-3">
          <p className="font-medium text-slate-950">{dictionary.metrics.airportRoutesHeading}</p>
          <div className="flex flex-wrap gap-2">
            <a className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white" href={routeLinks.airportToCampusUrl} target="_blank" rel="noreferrer">{dictionary.metrics.airportToCampus}</a>
            <a className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white" href={routeLinks.campusToAirportUrl} target="_blank" rel="noreferrer">{dictionary.metrics.campusToAirport}</a>
            <a className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700" href={routeLinks.airportToCampusTransitUrl} target="_blank" rel="noreferrer">{dictionary.metrics.airportToCampusTransit}</a>
            <a className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700" href={routeLinks.campusToAirportTransitUrl} target="_blank" rel="noreferrer">{dictionary.metrics.campusToAirportTransit}</a>
          </div>
          <div className="text-xs font-medium text-emerald-700">
            <a className="underline underline-offset-2" href={routeLinks.airportCoordinatesSource.url} target="_blank" rel="noreferrer">✓ {routeLinks.airportCoordinatesSource.label}</a>
            <span className="mx-2 text-slate-300">·</span>
            <a className="underline underline-offset-2" href={routeLinks.providerSource.url} target="_blank" rel="noreferrer">✓ {routeLinks.providerSource.label}</a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
