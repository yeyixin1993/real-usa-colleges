import type { Metadata } from 'next';

import { AdminConsole } from '@/components/admin/admin-console';
import { isAdminAuthenticatedFromCookies } from '@/lib/server/admin-auth';
import { getLocaleOrThrow } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Admin Console',
    description: 'School data admin editor',
  };
}

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = getLocaleOrThrow(localeParam);
  const authenticated = await isAdminAuthenticatedFromCookies();

  return (
    <main className="container section-space space-y-6">
      <AdminConsole locale={locale} authenticated={authenticated} />
    </main>
  );
}
