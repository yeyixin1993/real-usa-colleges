import Link from 'next/link';

import { LocaleSwitcher } from '@/components/layout/locale-switcher';
import { UnitSwitcher } from '@/components/layout/unit-switcher';
import { Button } from '@/components/ui/button';
import type { Dictionary } from '@/types/dictionary';
import type { Locale } from '@/types/school';

export function SiteHeader({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const navItems = [
    { href: `/${locale}`, label: dictionary.nav.home },
    { href: `/${locale}/schools`, label: dictionary.nav.schools },
    { href: `/${locale}/compare`, label: dictionary.nav.compare },
    { href: `/${locale}/collections`, label: dictionary.nav.collections },
    { href: `/${locale}/methodology`, label: dictionary.nav.methodology },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-background/85 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between gap-6">
        <Link href={`/${locale}`} className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">{dictionary.brand.name}</span>
          <span className="text-base font-semibold text-slate-900">{dictionary.brand.statement}</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-slate-600 transition hover:text-slate-950">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <UnitSwitcher />
          <LocaleSwitcher currentLocale={locale} />
          <Button asChild variant="secondary" size="sm" className="hidden md:inline-flex">
            <Link href={`/${locale}/schools`}>{dictionary.common.exploreSchools}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
