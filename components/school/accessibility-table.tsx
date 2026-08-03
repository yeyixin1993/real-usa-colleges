'use client';

import type { Dictionary } from '@/types/dictionary';
import type { CategoryKey, NullableAccessibilityPoint } from '@/types/school';

import { useUnitPreference } from '@/components/layout/unit-preference-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistance } from '@/lib/units';
import { formatMinutes } from '@/lib/utils';

function estimateWalkingMinutes(distanceMiles: number) {
  // 3 mph average walking speed ≈ 20 min / mile
  return Math.round(distanceMiles * 20);
}

function getWalkingMinutes(item: NullableAccessibilityPoint) {
  if (typeof item.walkingMinutes === 'number' && Number.isFinite(item.walkingMinutes)) {
    return item.walkingMinutes;
  }

  return typeof item.distanceMiles === 'number' ? estimateWalkingMinutes(item.distanceMiles) : null;
}

function availability(value: boolean | null) {
  if (value === null) return '—';
  return value ? 'Yes' : 'No';
}

export function AccessibilityTable({
  title,
  items,
  dictionary,
}: {
  title: string;
  items: Array<[CategoryKey, NullableAccessibilityPoint]>;
  dictionary: Dictionary;
}) {
  const { distanceUnit } = useUnitPreference();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3 text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="pb-2 pr-4 font-medium">Category</th>
              <th className="pb-2 pr-4 font-medium">{dictionary.metrics.nearestPlace}</th>
              <th className="pb-2 pr-4 font-medium">{dictionary.metrics.distance} ({distanceUnit})</th>
              <th className="pb-2 pr-4 font-medium">{dictionary.metrics.drivingTime}</th>
              <th className="pb-2 pr-4 font-medium">{dictionary.metrics.transitTime}</th>
              <th className="pb-2 pr-4 font-medium">{dictionary.metrics.walkingTime}</th>
              <th className="pb-2 pr-4 font-medium">{dictionary.metrics.uber}</th>
              <th className="pb-2 pr-4 font-medium">{dictionary.metrics.uberEats}</th>
            </tr>
          </thead>
          <tbody>
            {items.map(([key, item]) => (
              <tr key={key} className="rounded-2xl bg-white/80 text-slate-700 shadow-sm">
                <td className="rounded-l-2xl px-4 py-4 font-medium text-slate-900">{dictionary.categoryLabels[key]}</td>
                <td className="px-4 py-4">
                  <span>{item.name ?? '—'}</span>
                  {item.placeSource ? (
                    <a className="mt-1 block text-xs font-medium text-emerald-700 underline underline-offset-2" href={item.placeSource.url} target="_blank" rel="noreferrer">
                      ✓ {item.placeSource.label}
                    </a>
                  ) : null}
                </td>
                <td className="px-4 py-4">{item.distanceMiles == null ? '—' : formatDistance(item.distanceMiles, distanceUnit)}</td>
                <td className="px-4 py-4">{formatMinutes(item.driveMinutes)}</td>
                <td className="px-4 py-4">{formatMinutes(item.publicTransitMinutes)}</td>
                <td className="px-4 py-4">{formatMinutes(getWalkingMinutes(item))}</td>
                <td className="px-4 py-4">{availability(item.uberAvailable)}</td>
                <td className="rounded-r-2xl px-4 py-4">{availability(item.uberEatsAvailable)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
