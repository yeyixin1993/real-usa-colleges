'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { removeLocaleFromPath } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { locales, type Locale } from '@/types/school';

const labels: Record<Locale, string> = {
  zh: '中文',
  en: 'EN',
  ja: '日本語',
};

export function LocaleSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();
  const pathWithoutLocale = removeLocaleFromPath(pathname || '/');

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/85 p-1 shadow-sm">
      {locales.map((locale) => {
        const href = `/${locale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
        return (
          <Link
            key={locale}
            href={href}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-medium transition',
              locale === currentLocale ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100',
            )}
          >
            {labels[locale]}
          </Link>
        );
      })}
    </div>
  );
}
