'use client';

import type { Dictionary } from '@/types/dictionary';
import type { AccessibilityPoint, CategoryKey } from '@/types/school';

import { useUnitPreference } from '@/components/layout/unit-preference-provider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistance } from '@/lib/units';
import { formatMinutes } from '@/lib/utils';

export function AccessibilityTable({
  title,
  items,
  dictionary,
}: {
  title: string;
  items: Array<[CategoryKey, AccessibilityPoint]>;
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
              <th className="pb-2 pr-4 font-medium">{dictionary.metrics.uber}</th>
              <th className="pb-2 pr-4 font-medium">{dictionary.metrics.uberEats}</th>
            </tr>
          </thead>
          <tbody>
            {items.map(([key, item]) => (
              <tr key={key} className="rounded-2xl bg-white/80 text-slate-700 shadow-sm">
                <td className="rounded-l-2xl px-4 py-4 font-medium text-slate-900">{dictionary.categoryLabels[key]}</td>
                <td className="px-4 py-4">{item.name}</td>
                <td className="px-4 py-4">{formatDistance(item.distanceMiles, distanceUnit)}</td>
                <td className="px-4 py-4">{formatMinutes(item.driveMinutes)}</td>
                <td className="px-4 py-4">{formatMinutes(item.publicTransitMinutes)}</td>
                <td className="px-4 py-4">
                  <Badge className={item.uberAvailable ? 'text-emerald-700' : 'text-slate-500'}>{item.uberAvailable ? 'Yes' : 'No'}</Badge>
                </td>
                <td className="rounded-r-2xl px-4 py-4">
                  <Badge className={item.uberEatsAvailable ? 'text-emerald-700' : 'text-slate-500'}>{item.uberEatsAvailable ? 'Yes' : 'No'}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
