'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { UsMap } from '@/components/map/us-map';
import { EmptyState } from '@/components/shared/empty-state';
import { ScoreBadge } from '@/components/shared/score-badge';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import type { Dictionary } from '@/types/dictionary';
import type { ClimateBand, Locale, Region, School, SchoolType, Sector } from '@/types/school';

function FilterSelect({
  value,
  onChange,
  label,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  options: string[];
}) {
  return (
    <label className="space-y-2 text-sm text-slate-600">
      <span className="font-medium text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-2xl border border-border bg-white/90 px-4 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function DirectoryClient({ locale, dictionary, schools }: { locale: Locale; dictionary: Dictionary; schools: School[] }) {
  const [query, setQuery] = useState('');
  const [schoolType, setSchoolType] = useState(dictionary.directory.allTypes);
  const [rankingBand, setRankingBand] = useState(dictionary.directory.allRankingBands);
  const [state, setState] = useState(dictionary.directory.allStates);
  const [region, setRegion] = useState(dictionary.directory.allRegions);
  const [climateBand, setClimateBand] = useState(dictionary.directory.allClimateBands);
  const [sector, setSector] = useState(dictionary.directory.allSectors);

  const filteredSchools = useMemo(() => {
    return schools.filter((school) => {
      const matchesQuery = school.name.toLowerCase().includes(query.toLowerCase());
      const matchesType = schoolType === dictionary.directory.allTypes || school.schoolType === (schoolType as SchoolType);
      const matchesRanking = rankingBand === dictionary.directory.allRankingBands || school.rankingBand === rankingBand;
      const matchesState = state === dictionary.directory.allStates || school.state === state;
      const matchesRegion = region === dictionary.directory.allRegions || school.region === (region as Region);
      const matchesClimate = climateBand === dictionary.directory.allClimateBands || school.climateBand === (climateBand as ClimateBand);
      const matchesSector = sector === dictionary.directory.allSectors || school.sector === (sector as Sector);
      return matchesQuery && matchesType && matchesRanking && matchesState && matchesRegion && matchesClimate && matchesSector;
    });
  }, [climateBand, dictionary.directory.allClimateBands, dictionary.directory.allRankingBands, dictionary.directory.allRegions, dictionary.directory.allSectors, dictionary.directory.allStates, dictionary.directory.allTypes, query, rankingBand, region, schoolType, schools, sector, state]);

  const reset = () => {
    setQuery('');
    setSchoolType(dictionary.directory.allTypes);
    setRankingBand(dictionary.directory.allRankingBands);
    setState(dictionary.directory.allStates);
    setRegion(dictionary.directory.allRegions);
    setClimateBand(dictionary.directory.allClimateBands);
    setSector(dictionary.directory.allSectors);
  };

  const rankingBands = [dictionary.directory.allRankingBands, ...new Set(schools.map((school) => school.rankingBand))];
  const states = [dictionary.directory.allStates, ...new Set(schools.map((school) => school.state))];
  const regions = [dictionary.directory.allRegions, ...new Set(schools.map((school) => school.region))];
  const climates = [dictionary.directory.allClimateBands, ...new Set(schools.map((school) => school.climateBand))];
  const schoolTypes = [dictionary.directory.allTypes, ...new Set(schools.map((school) => school.schoolType))];
  const sectors = [dictionary.directory.allSectors, ...new Set(schools.map((school) => school.sector))];

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-7">
          <div className="md:col-span-2 xl:col-span-2">
            <label className="space-y-2 text-sm text-slate-600">
              <span className="font-medium text-slate-500">{dictionary.directory.searchPlaceholder}</span>
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={dictionary.directory.searchPlaceholder} />
            </label>
          </div>
          <FilterSelect value={schoolType} onChange={setSchoolType} label={dictionary.filters.schoolType} options={schoolTypes} />
          <FilterSelect value={rankingBand} onChange={setRankingBand} label={dictionary.filters.rankingBand} options={rankingBands} />
          <FilterSelect value={state} onChange={setState} label={dictionary.filters.state} options={states} />
          <FilterSelect value={region} onChange={setRegion} label={dictionary.filters.region} options={regions} />
          <FilterSelect value={climateBand} onChange={setClimateBand} label={dictionary.filters.climateBand} options={climates} />
          <FilterSelect value={sector} onChange={setSector} label={dictionary.filters.sector} options={sectors} />
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              {filteredSchools.length} {dictionary.directory.resultCount}
            </p>
            <p className="text-sm text-slate-500">{dictionary.directory.mapHint}</p>
          </div>
          {filteredSchools.length === 0 ? (
            <EmptyState title={dictionary.common.noResults} description={dictionary.common.staticDataNote} actionLabel={dictionary.common.resetFilters} onAction={reset} />
          ) : (
            <div className="space-y-4">
              {filteredSchools.map((school) => (
                <Link key={school.slug} href={`/${locale}/schools/${school.slug}`}>
                  <Card className="transition hover:-translate-y-1 hover:shadow-glow">
                    <CardContent className="space-y-4 p-5">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge>{school.schoolType}</Badge>
                            <Badge>{school.sector}</Badge>
                            <Badge>{school.rankingBand}</Badge>
                          </div>
                          <h3 className="text-xl font-semibold text-slate-950">{school.name}</h3>
                          <p className="text-sm text-slate-500">
                            {school.city}, {school.state}
                          </p>
                          <p className="max-w-2xl text-sm leading-6 text-slate-600">{school.summary[locale]}</p>
                        </div>
                        <ScoreBadge score={school.scores.overall} label={dictionary.metrics.overallScore} />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {school.tags.map((tag) => (
                          <Badge key={tag}>{dictionary.tagLabels[tag]}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="xl:sticky xl:top-28 xl:self-start">
          <UsMap schools={filteredSchools.length ? filteredSchools : schools} locale={locale} />
        </div>
      </div>
    </div>
  );
}
