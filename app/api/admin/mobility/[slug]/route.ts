import { NextRequest, NextResponse } from 'next/server';

import { getAdminSchoolBySlug } from '@/lib/data';
import { isAdminAuthenticatedFromRequest } from '@/lib/server/admin-auth';
import { getMobilityOverride, upsertMobilityOverride } from '@/lib/server/mobility-overrides';
import type { MobilityProfile } from '@/types/mobility';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!isAdminAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;
  const school = await getAdminSchoolBySlug(slug);
  if (!school) {
    return NextResponse.json({ error: 'School not found' }, { status: 404 });
  }

  const override = await getMobilityOverride(slug);
  const mobility: Partial<MobilityProfile> = {
    school_name: school.name,
    tags: [],
    summary: '',
    ...(override ?? {}),
  };

  return NextResponse.json({ mobility, override });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!isAdminAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;
  const school = await getAdminSchoolBySlug(slug);
  if (!school) {
    return NextResponse.json({ error: 'School not found' }, { status: 404 });
  }

  const patch = (await request.json()) as Partial<MobilityProfile>;
  const override = await upsertMobilityOverride(slug, { school_name: school.name, ...patch });

  return NextResponse.json({ ok: true, slug, override });
}
