import Link from 'next/link';

import type { Dictionary } from '@/types/dictionary';
import type { Locale } from '@/types/school';

export function SiteFooter({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  return (
    <footer className="border-t border-slate-200/80 bg-white/70">
      <div className="container flex flex-col gap-6 py-10 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900">{dictionary.brand.name}</p>
          <p className="max-w-xl text-sm leading-6 text-slate-600">{dictionary.footer.note}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
          <Link href={`/${locale}/methodology`} className="hover:text-slate-950">
            {dictionary.footer.methodology}
          </Link>
          <Link href={`/${locale}/methodology#data-transparency`} className="hover:text-slate-950">
            {dictionary.footer.dataTransparency}
          </Link>
        </div>
      </div>
    </footer>
  );
}
