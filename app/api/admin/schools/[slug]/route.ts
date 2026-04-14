import { NextRequest, NextResponse } from 'next/server';

import { getSchoolBySlug } from '@/lib/data';
import { isAdminAuthenticatedFromRequest } from '@/lib/server/admin-auth';
import { getSchoolOverride, upsertSchoolOverride } from '@/lib/server/school-overrides';
import type { School } from '@/types/school';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!isAdminAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;
  const school = await getSchoolBySlug(slug);

  if (!school) {
    return NextResponse.json({ error: 'School not found' }, { status: 404 });
  }

  const override = await getSchoolOverride(slug);

  return NextResponse.json({ school, override });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!isAdminAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;
  const school = await getSchoolBySlug(slug);

  if (!school) {
    return NextResponse.json({ error: 'School not found' }, { status: 404 });
  }

  const patch = (await request.json()) as Partial<School>;
  const override = await upsertSchoolOverride(slug, patch);

  return NextResponse.json({ ok: true, slug, override });
}
