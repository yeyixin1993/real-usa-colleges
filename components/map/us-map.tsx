'use client';

import { geoAlbersUsa, geoPath } from 'd3-geo';
import { useMemo, useState } from 'react';
import { feature } from 'topojson-client';
import usAtlas from 'us-atlas/states-10m.json';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn, formatNumber } from '@/lib/utils';
import type { Locale, PublicSchool } from '@/types/school';

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 620;
const verifiedLocationSourceCopy: Record<Locale, string> = {
  en: 'U.S. Department of Education College Scorecard',
  zh: '美国教育部 College Scorecard',
  ja: '米国教育省 College Scorecard',
};
const undergraduateEnrollmentCopy: Record<Locale, string> = {
  en: 'Undergraduate enrollment',
  zh: '本科生人数',
  ja: '学部生数',
};
const undergraduateTuitionCopy: Record<Locale, string> = {
  en: 'Undergraduate tuition',
  zh: '本科 Tuition',
  ja: '学部 Tuition',
};
const totalCostCopy: Record<Locale, string> = {
  en: 'Total cost',
  zh: 'Total cost',
  ja: 'Total cost',
};
const fipsToStateCode: Record<string, string> = {
  '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA', '08': 'CO', '09': 'CT',
  '10': 'DE', '11': 'DC', '12': 'FL', '13': 'GA', '15': 'HI', '16': 'ID', '17': 'IL',
  '18': 'IN', '19': 'IA', '20': 'KS', '21': 'KY', '22': 'LA', '23': 'ME', '24': 'MD',
  '25': 'MA', '26': 'MI', '27': 'MN', '28': 'MS', '29': 'MO', '30': 'MT', '31': 'NE',
  '32': 'NV', '33': 'NH', '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND',
  '39': 'OH', '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI', '45': 'SC', '46': 'SD',
  '47': 'TN', '48': 'TX', '49': 'UT', '50': 'VT', '51': 'VA', '53': 'WA', '54': 'WV',
  '55': 'WI', '56': 'WY',
};

function formatUsd(value: number | null | undefined) {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function UsMap({
  schools,
  locale,
  selectedSlug,
  showLinks = true,
  fullPage = false,
}: {
  schools: PublicSchool[];
  locale: Locale;
  selectedSlug?: string;
  showLinks?: boolean;
  fullPage?: boolean;
}) {
  const [hovered, setHovered] = useState<string | null>(selectedSlug ?? null);
  const [selectedStateCode, setSelectedStateCode] = useState<string | null>(null);

  const stateOptions = useMemo(
    () =>
      [...new Map(schools.map((school) => [school.stateCode, school.state])).entries()]
        .map(([code, name]) => ({ code, name }))
        .sort((left, right) => left.name.localeCompare(right.name)),
    [schools],
  );
  const activeStateCode = stateOptions.some((state) => state.code === selectedStateCode)
    ? selectedStateCode
    : null;
  const stateSchools = useMemo(
    () => (activeStateCode ? schools.filter((school) => school.stateCode === activeStateCode) : schools),
    [activeStateCode, schools],
  );

  const activeSchool = useMemo(
    () => stateSchools.find((school) => school.slug === (hovered ?? selectedSlug)) ?? stateSchools[0],
    [hovered, selectedSlug, stateSchools],
  );

  const selectState = (stateCode: string | null) => {
    setSelectedStateCode(stateCode);
    const firstSchool = stateCode ? schools.find((school) => school.stateCode === stateCode) : schools[0];
    setHovered(firstSchool?.slug ?? null);
  };

  const mapData = useMemo(() => {
    const topology = (usAtlas as any)?.objects ? (usAtlas as any) : (usAtlas as any)?.default;

    if (!topology?.objects?.states) {
      return { statePaths: [], markers: [] as Array<{ slug: string; school: PublicSchool; x: number; y: number }> };
    }

    const states = feature(topology, topology.objects.states) as any;

    const selectedFeature = activeStateCode
      ? (states.features as any[]).find(
          (state) => fipsToStateCode[String(state.id).padStart(2, '0')] === activeStateCode,
        )
      : null;
    const projection = selectedFeature
      ? geoAlbersUsa().fitExtent([[60, 40], [MAP_WIDTH - 60, MAP_HEIGHT - 40]], selectedFeature as any)
      : geoAlbersUsa().fitSize([MAP_WIDTH, MAP_HEIGHT], states as any);
    const pathGenerator = geoPath(projection);

    const statePaths = (selectedFeature ? [selectedFeature] : (states.features as any[]))
      .map((state) => {
        const d = pathGenerator(state as never);
        if (!d) return null;
        const stateCode = fipsToStateCode[String(state.id).padStart(2, '0')] ?? null;
        return { id: state.id, d, stateCode };
      })
      .filter(Boolean) as Array<{ id: string; d: string; stateCode: string | null }>;

    const markers = stateSchools
      .filter((school) => school.verification?.verifiedFields.includes('coordinates'))
      .map((school) => {
        const point = projection([school.coordinates.lng, school.coordinates.lat]);
        if (!point) return null;
        const [x, y] = point;
        return {
          slug: school.slug,
          school,
          x,
          y,
        };
      })
      .filter(Boolean) as Array<{ slug: string; school: PublicSchool; x: number; y: number }>;

    return { statePaths, markers };
  }, [activeStateCode, stateSchools]);

  return (
    <div className={cn('grid gap-4', fullPage ? 'xl:grid-cols-[1.8fr_0.7fr]' : 'lg:grid-cols-[1.4fr_0.6fr]')}>
      <Card className="relative overflow-hidden p-4 md:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.12),_transparent_45%),linear-gradient(180deg,_rgba(248,250,252,0.95),_rgba(241,245,249,0.9))]" />

        <div className="relative z-10 mb-4 flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-slate-600">
            <span className="sr-only">Select a state</span>
            <select
              value={activeStateCode ?? ''}
              onChange={(event) => selectState(event.target.value || null)}
              className="h-10 rounded-xl border border-slate-300 bg-white px-3"
            >
              <option value="">All United States</option>
              {stateOptions.map((state) => <option key={state.code} value={state.code}>{state.name}</option>)}
            </select>
          </label>
          {activeStateCode ? (
            <button type="button" onClick={() => selectState(null)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Reset U.S. view
            </button>
          ) : null}
          <span className="text-xs text-slate-500">Select a state or click it on the map to zoom and list schools.</span>
        </div>

        <div className={cn('relative z-10 w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-white', fullPage ? 'h-[72vh] min-h-[560px]' : 'aspect-[16/10]')}>
          <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="absolute inset-0 h-full w-full">
            <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#oceanGradient)" />
            <defs>
              <linearGradient id="oceanGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#eef6ff" />
                <stop offset="100%" stopColor="#e8f0fb" />
              </linearGradient>
            </defs>

            {mapData.statePaths.map((state) => (
              <path
                key={state.id}
                d={state.d}
                fill={activeStateCode ? '#dbeafe' : state.stateCode && stateOptions.some((item) => item.code === state.stateCode) ? '#f8fafc' : '#f1f5f9'}
                stroke="#64748b"
                strokeOpacity="0.65"
                strokeWidth="0.9"
                role={state.stateCode && stateOptions.some((item) => item.code === state.stateCode) ? 'button' : undefined}
                aria-label={state.stateCode ? `Zoom to ${state.stateCode}` : undefined}
                tabIndex={state.stateCode && stateOptions.some((item) => item.code === state.stateCode) ? 0 : undefined}
                className={state.stateCode && stateOptions.some((item) => item.code === state.stateCode) ? 'cursor-pointer transition hover:fill-blue-100' : undefined}
                onClick={() => state.stateCode && stateOptions.some((item) => item.code === state.stateCode) && selectState(state.stateCode)}
                onKeyDown={(event) => {
                  if ((event.key === 'Enter' || event.key === ' ') && state.stateCode) selectState(state.stateCode);
                }}
              />
            ))}

            {mapData.markers.map((marker) => {
              const isActive = marker.slug === activeSchool?.slug;

              const markerDot = (
                <>
                  <circle
                    cx={marker.x}
                    cy={marker.y}
                    r={isActive ? 9 : 6}
                    fill={isActive ? '#0f172a' : '#2563eb'}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                  {isActive ? <circle cx={marker.x} cy={marker.y} r={16} fill="#0f172a" fillOpacity={0.18} /> : null}
                </>
              );

              if (showLinks) {
                return (
                  <a
                    key={marker.slug}
                    href={`/${locale}/schools/${marker.slug}`}
                    aria-label={marker.school.name}
                    onMouseEnter={() => setHovered(marker.slug)}
                    onFocus={() => setHovered(marker.slug)}
                  >
                    {markerDot}
                  </a>
                );
              }

              return (
                <g key={marker.slug} onMouseEnter={() => setHovered(marker.slug)} onFocus={() => setHovered(marker.slug)}>
                  {markerDot}
                </g>
              );
            })}
          </svg>

          {mapData.statePaths.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/90 text-sm text-slate-500">
              U.S. map failed to load topology data.
            </div>
          ) : null}

        </div>
        <div className="relative z-10 mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
          <span>U.S. map preview with state boundaries</span>
          <span>•</span>
          <span>Marker positions are school-coordinate based</span>
        </div>
      </Card>

      {activeSchool ? (
        <Card className={cn('p-6', fullPage ? 'xl:h-full' : undefined)}>
          <div className="space-y-4">
            {activeStateCode ? (
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Schools in {activeSchool.state}</p>
                <div className="mt-3 max-h-56 space-y-2 overflow-y-auto pr-1">
                  {stateSchools.map((school) => (
                    <a
                      key={school.slug}
                      href={`/${locale}/schools/${school.slug}`}
                      onMouseEnter={() => setHovered(school.slug)}
                      onFocus={() => setHovered(school.slug)}
                      className={cn('block rounded-2xl border px-3 py-2 text-sm transition', school.slug === activeSchool.slug ? 'border-blue-300 bg-blue-50 text-blue-950' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50')}
                    >
                      {school.name}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="space-y-2">
              <Badge>{activeSchool.sector}</Badge>
              <h3 className="text-xl font-semibold text-slate-950">{activeSchool.name}</h3>
              <p className="text-sm text-slate-500">
                {activeSchool.city}, {activeSchool.state}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl bg-slate-950 px-4 py-5 text-white">
                <p className="text-xs uppercase tracking-[0.2em] text-white/65">Verified location</p>
                <p className="mt-3 text-sm leading-6 text-white/80">{verifiedLocationSourceCopy[locale]}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white/65">{undergraduateEnrollmentCopy[locale]}</p>
                <p className="mt-1 text-2xl font-semibold text-white">
                  {activeSchool.verification?.undergraduateEnrollment == null ? '—' : formatNumber(activeSchool.verification.undergraduateEnrollment)}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white/65">{undergraduateTuitionCopy[locale]}</p>
                <p className="mt-1 text-lg font-semibold text-white">{formatUsd(activeSchool.verification?.undergraduateTuitionUsd)}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white/65">{totalCostCopy[locale]}</p>
                <p className="mt-1 text-lg font-semibold text-white">{formatUsd(activeSchool.verification?.totalCostUsd)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-500">{activeSchool.sector}</p>
                <p className="text-xs leading-5 text-slate-500">Map pins use the federal dataset coordinates and never a city or state fallback.</p>
              </div>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
