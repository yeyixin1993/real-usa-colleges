import type { ReactNode } from 'react';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { UnitPreferenceProvider } from '@/components/layout/unit-preference-provider';
import { getDictionary, getLocaleOrThrow } from '@/lib/i18n';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = getLocaleOrThrow(localeParam);
  const dictionary = getDictionary(locale);

  return (
    <UnitPreferenceProvider locale={locale}>
      <div className="min-h-screen bg-background">
        <SiteHeader locale={locale} dictionary={dictionary} />
        {children}
        <SiteFooter locale={locale} dictionary={dictionary} />
      </div>
    </UnitPreferenceProvider>
  );
}
