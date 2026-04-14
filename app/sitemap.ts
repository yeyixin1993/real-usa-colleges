import type { MetadataRoute } from 'next';

import { collections } from '@/data/collections';
import { extraSchools } from '@/data/schools-extra';
import { schools } from '@/data/schools';
import { locales } from '@/types/school';

const baseUrl = 'https://northatlas.example.com';
const allSchools = [...schools, ...extraSchools];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = locales.flatMap((locale) => [
    `/${locale}`,
    `/${locale}/schools`,
    `/${locale}/compare`,
    `/${locale}/methodology`,
    `/${locale}/collections`,
    ...allSchools.map((school) => `/${locale}/schools/${school.slug}`),
    ...collections.map((collection) => `/${locale}/collections/${collection.slug}`),
  ]);

  return pages.map((path) => ({ url: `${baseUrl}${path}` }));
}
