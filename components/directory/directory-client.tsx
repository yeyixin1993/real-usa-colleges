'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { UsMap } from '@/components/map/us-map';
import { EmptyState } from '@/components/shared/empty-state';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import type { Dictionary } from '@/types/dictionary';
import type { Locale, PublicSchool, Sector } from '@/types/school';

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

export function DirectoryClient({ locale, dictionary, schools }: { locale: Locale; dictionary: Dictionary; schools: PublicSchool[] }) {
  const [query, setQuery] = useState('');
  const [state, setState] = useState(dictionary.directory.allStates);
  const [sector, setSector] = useState(dictionary.directory.allSectors);

  const filteredSchools = useMemo(() => {
    return schools.filter((school) => {
      const matchesQuery = school.name.toLowerCase().includes(query.toLowerCase());
      const matchesState = state === dictionary.directory.allStates || school.state === state;
      const matchesSector = sector === dictionary.directory.allSectors || school.sector === (sector as Sector);
      return matchesQuery && matchesState && matchesSector;
    });
  }, [dictionary.directory.allSectors, dictionary.directory.allStates, query, schools, sector, state]);

  const reset = () => {
    setQuery('');
    setState(dictionary.directory.allStates);
    setSector(dictionary.directory.allSectors);
  };

  const states = [dictionary.directory.allStates, ...new Set(schools.map((school) => school.state))];
  const sectors = [dictionary.directory.allSectors, ...new Set(schools.map((school) => school.sector))];

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="md:col-span-2">
            <label className="space-y-2 text-sm text-slate-600">
              <span className="font-medium text-slate-500">{dictionary.directory.searchPlaceholder}</span>
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={dictionary.directory.searchPlaceholder} />
            </label>
          </div>
          <FilterSelect value={state} onChange={setState} label={dictionary.filters.state} options={states} />
          <FilterSelect value={sector} onChange={setSector} label={dictionary.filters.sector} options={sectors} />
        </CardContent>
      </Card>

      <div className="space-y-6">
        <UsMap schools={filteredSchools.length ? filteredSchools : schools} locale={locale} fullPage />

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
                            <Badge>{school.sector}</Badge>
                            <Badge>Verified federal record</Badge>
                          </div>
                          <h3 className="text-xl font-semibold text-slate-950">{school.name}</h3>
                          <p className="text-sm text-slate-500">
                            {school.city}, {school.state}
                          </p>
                          <p className="max-w-2xl text-sm leading-6 text-slate-600">College Scorecard UNITID {school.verification?.unitId}</p>
                        </div>
                        {school.verification?.website ? (
                          <span className="text-sm font-medium text-primary">Official website available</span>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
