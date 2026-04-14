import type { Dictionary } from '@/types/dictionary';
import type { DemographicBreakdown } from '@/types/school';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber, formatPercent } from '@/lib/utils';

function DemographicRow({ label, value }: { label: string; value?: number }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3 text-sm last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value === undefined ? '—' : formatPercent(value)}</span>
    </div>
  );
}

export function DemographicsPanel({
  title,
  data,
  dictionary,
}: {
  title: string;
  data: DemographicBreakdown;
  dictionary: Dictionary;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <DemographicRow label={dictionary.metrics.white} value={data.white} />
        <DemographicRow label={dictionary.metrics.black} value={data.black} />
        <DemographicRow label={dictionary.metrics.hispanicLatino} value={data.hispanicLatino} />
        <DemographicRow label={dictionary.metrics.asian} value={data.asian} />
        <DemographicRow label={dictionary.metrics.internationalStudents} value={data.internationalStudents} />
        <DemographicRow label={dictionary.metrics.foreignBornShare} value={data.foreignBornShare} />
        <div className="flex items-center justify-between border-b border-slate-100 py-3 text-sm">
          <span className="text-slate-500">{dictionary.metrics.medianHouseholdIncome}</span>
          <span className="font-medium text-slate-900">
            {data.medianHouseholdIncomeUsd ? `$${formatNumber(data.medianHouseholdIncomeUsd)}` : '—'}
          </span>
        </div>
        <div className="flex items-center justify-between py-3 text-sm">
          <span className="text-slate-500">{dictionary.metrics.populationDensityBand}</span>
          <span className="font-medium text-slate-900">{data.populationDensityBand}</span>
        </div>
      </CardContent>
    </Card>
  );
}
