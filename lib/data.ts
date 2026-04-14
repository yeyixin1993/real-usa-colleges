import { cache } from 'react';

import { collections } from '@/data/collections';
import { extraSchools } from '@/data/schools-top100';
import { schools } from '@/data/schools';
import type { DiscoveryCollection, Locale, School } from '@/types/school';

// Server components already consume repository-style functions, so the mock layer can
// later be swapped for PostgreSQL + PostGIS queries without rewriting page components.
export const getSchools = cache(async (): Promise<School[]> => [...schools, ...extraSchools]);

export const getSchoolBySlug = cache(async (slug: string) => {
  const allSchools = await getSchools();
  return allSchools.find((school) => school.slug === slug);
});

export const getFeaturedSchools = cache(async () => (await getSchools()).slice(0, 4));

export const getCollections = cache(async (): Promise<DiscoveryCollection[]> => collections);

export const getCollectionBySlug = cache(async (slug: string) => {
  const allCollections = await getCollections();
  return allCollections.find((collection) => collection.slug === slug);
});

export async function getSchoolsForCollection(slug: string) {
  const [collection, allSchools] = await Promise.all([getCollectionBySlug(slug), getSchools()]);

  if (!collection) return [];

  return collection.schoolSlugs
    .map((schoolSlug) => allSchools.find((school) => school.slug === schoolSlug))
    .filter(Boolean) as School[];
}

export async function getSchoolComparisons(slugs: string[]) {
  const allSchools = await getSchools();
  return slugs
    .map((slug) => allSchools.find((school) => school.slug === slug))
    .filter(Boolean) as School[];
}

export function getLocalizedText(locale: Locale, value: Record<Locale, string>) {
  return value[locale];
}

export function getStates(allSchools: School[]) {
  return [...new Set(allSchools.map((school) => school.state))].sort();
}

export function getRankingBands(allSchools: School[]) {
  return [...new Set(allSchools.map((school) => school.rankingBand))];
}
