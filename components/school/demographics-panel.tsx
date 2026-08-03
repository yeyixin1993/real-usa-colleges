import type { Dictionary } from '@/types/dictionary';
import type { DemographicBreakdown } from '@/types/school';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber, formatPercent } from '@/lib/utils';

function DemographicRow({ label, value }: { label: string; value?: number | null }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3 text-sm last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value == null ? '—' : formatPercent(value)}</span>
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
  const settingLabel = data.campusSetting === 'Urban'
    ? dictionary.metrics.urban
    : data.campusSetting === 'Suburban'
      ? dictionary.metrics.suburban
      : data.campusSetting === 'Rural'
        ? dictionary.metrics.rural
        : '—';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {data.source ? <a className="text-xs font-medium text-emerald-700 underline underline-offset-2" href={data.source.url} target="_blank" rel="noreferrer">✓ {data.source.label}</a> : null}
      </CardHeader>
      <CardContent>
        <DemographicRow label={dictionary.metrics.white} value={data.white} />
        <DemographicRow label={dictionary.metrics.black} value={data.black} />
        <DemographicRow label={dictionary.metrics.hispanicLatino} value={data.hispanicLatino} />
        <DemographicRow label={dictionary.metrics.asian} value={data.asian} />
        <DemographicRow label={dictionary.metrics.internationalStudents} value={data.internationalStudents} />
        <DemographicRow label={dictionary.metrics.maleUndergraduates} value={data.maleUndergraduates} />
        <DemographicRow label={dictionary.metrics.femaleUndergraduates} value={data.femaleUndergraduates} />
        <DemographicRow label={dictionary.metrics.age25OrOlder} value={data.age25OrOlder} />
        <div className="flex items-center justify-between border-b border-slate-100 py-3 text-sm">
          <span className="text-slate-500">{dictionary.metrics.populationWithin30Km}</span>
          <span className="text-right font-medium text-slate-900">
            <span className="block">{data.populationWithin30Km == null ? '—' : formatNumber(data.populationWithin30Km)}</span>
            {data.populationWithin30KmSource ? <a className="mt-1 block text-xs text-emerald-700 underline underline-offset-2" href={data.populationWithin30KmSource.url} target="_blank" rel="noreferrer">✓ {data.populationWithin30KmSource.label}</a> : null}
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-slate-100 py-3 text-sm">
          <span className="text-slate-500">{dictionary.metrics.campusSetting}</span>
          <span className="text-right font-medium text-slate-900">
            {settingLabel}{data.campusSettingDetail ? ` · ${data.campusSettingDetail} ` : ''}
            {data.localeCode != null ? <a className="text-primary underline underline-offset-2" href="https://nces.ed.gov/surveys/annualreports/topical-studies/locale/definitions" target="_blank" rel="noreferrer">(IPEDS {data.localeCode})</a> : null}
          </span>
        </div>
        {data.localeCode != null ? (
          <div className="space-y-2 py-3 text-xs leading-5 text-slate-600">
            <p>{dictionary.metrics.ipedsLocaleExplanation}</p>
            <a className="font-medium text-emerald-700 underline underline-offset-2" href="https://nces.ed.gov/surveys/annualreports/topical-studies/locale/definitions" target="_blank" rel="noreferrer">✓ {dictionary.metrics.ipedsLocaleSource}</a>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
