import { notFound } from 'next/navigation';

import { en } from '@/dictionaries/en';
import { ja } from '@/dictionaries/ja';
import { zh } from '@/dictionaries/zh';
import type { Dictionary } from '@/types/dictionary';
import { locales, type Locale } from '@/types/school';

const dictionaries: Record<Locale, Dictionary> = {
  en,
  zh,
  ja,
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocaleOrThrow(value: string): Locale {
  if (!isLocale(value)) {
    notFound();
  }

  return value;
}

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export function removeLocaleFromPath(pathname: string) {
  const segments = pathname.split('/');
  const [, first, ...rest] = segments;
  return locales.includes(first as Locale) ? `/${rest.join('/')}` : pathname;
}
