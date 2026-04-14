import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function LocaleNotFound() {
  return (
    <main className="container section-space flex flex-col items-start gap-6">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">404</p>
        <h1 className="text-4xl font-semibold text-slate-950">Page not found</h1>
        <p className="max-w-xl text-slate-600">The requested route is not available in the current launch mock.</p>
      </div>
      <Button asChild>
        <Link href="/zh">Return home</Link>
      </Button>
    </main>
  );
}
