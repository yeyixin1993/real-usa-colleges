'use client';

import { useUnitPreference } from '@/components/layout/unit-preference-provider';
import { formatDistance } from '@/lib/units';
import { formatMinutes } from '@/lib/utils';
import type { Dictionary } from '@/types/dictionary';

export function AirportMetrics({
  distanceMiles,
  driveMinutes,
  transitMinutes,
  dictionary,
}: {
  distanceMiles: number;
  driveMinutes: number;
  transitMinutes: number | null;
  dictionary: Dictionary;
}) {
  const { distanceUnit } = useUnitPreference();

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div>
        <p className="text-sm text-slate-500">{dictionary.metrics.distance}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-950">{formatDistance(distanceMiles, distanceUnit)}</p>
      </div>
      <div>
        <p className="text-sm text-slate-500">{dictionary.metrics.drivingTime}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-950">{formatMinutes(driveMinutes)}</p>
      </div>
      <div>
        <p className="text-sm text-slate-500">{dictionary.metrics.transitTime}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-950">{formatMinutes(transitMinutes)}</p>
      </div>
    </div>
  );
}
