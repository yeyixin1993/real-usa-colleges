'use client';

import { geoAlbersUsa, geoPath } from 'd3-geo';
import { useMemo, useState } from 'react';
import { feature } from 'topojson-client';
import usAtlas from 'us-atlas/states-10m.json';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getGrade } from '@/lib/grades';
import { cn } from '@/lib/utils';
import type { Locale, School } from '@/types/school';

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 620;

export function UsMap({
  schools,
  locale,
  selectedSlug,
  showLinks = true,
  fullPage = false,
}: {
  schools: School[];
  locale: Locale;
  selectedSlug?: string;
  showLinks?: boolean;
  fullPage?: boolean;
}) {
  const [hovered, setHovered] = useState<string | null>(selectedSlug ?? null);

  const activeSchool = useMemo(
    () => schools.find((school) => school.slug === (hovered ?? selectedSlug)) ?? schools[0],
    [hovered, schools, selectedSlug],
  );

  const mapData = useMemo(() => {
    const topology = (usAtlas as any)?.objects ? (usAtlas as any) : (usAtlas as any)?.default;

    if (!topology?.objects?.states) {
      return { statePaths: [], markers: [] as Array<{ slug: string; school: School; x: number; y: number }> };
    }

    const states = feature(topology, topology.objects.states) as any;

    const projection = geoAlbersUsa().fitSize([MAP_WIDTH, MAP_HEIGHT], states as any);
    const pathGenerator = geoPath(projection);

    const statePaths = (states.features as any[])
      .map((state) => {
        const d = pathGenerator(state as never);
        if (!d) return null;
        return { id: state.id, d };
      })
      .filter(Boolean) as Array<{ id: string; d: string }>;

    const markers = schools
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
      .filter(Boolean) as Array<{ slug: string; school: School; x: number; y: number }>;

    return { statePaths, markers };
  }, [schools]);

  return (
    <div className={cn('grid gap-4', fullPage ? 'xl:grid-cols-[1.8fr_0.7fr]' : 'lg:grid-cols-[1.4fr_0.6fr]')}>
      <Card className="relative overflow-hidden p-4 md:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.12),_transparent_45%),linear-gradient(180deg,_rgba(248,250,252,0.95),_rgba(241,245,249,0.9))]" />

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
                fill="#f8fafc"
                stroke="#64748b"
                strokeOpacity="0.65"
                strokeWidth="0.9"
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
            <div className="space-y-2">
              <Badge>{activeSchool.schoolType}</Badge>
              <h3 className="text-xl font-semibold text-slate-950">{activeSchool.name}</h3>
              <p className="text-sm text-slate-500">
                {activeSchool.city}, {activeSchool.state}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl bg-slate-950 px-4 py-5 text-white">
                <p className="text-xs uppercase tracking-[0.2em] text-white/65">Overall</p>
                <div className="mt-3 flex items-end gap-3">
                  <span className="text-4xl font-semibold">{activeSchool.scores.overall}</span>
                  <span className="text-base font-medium text-white/70">{getGrade(activeSchool.scores.overall)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-500">{activeSchool.rankingLabel}</p>
                <div className="flex flex-wrap gap-2">
                  {activeSchool.tags.map((tag) => (
                    <span key={tag} className={cn('rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600')}>
                      {tag.replaceAll('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
