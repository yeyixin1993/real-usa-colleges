import { NextRequest, NextResponse } from 'next/server';

import { isAdminAuthenticatedFromRequest } from '@/lib/server/admin-auth';
import { getScoringConfig, upsertScoringConfig } from '@/lib/server/scoring-config';
import type { ScoringConfig } from '@/types/scoring';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const config = await getScoringConfig();
  return NextResponse.json({ config });
}

export async function PATCH(request: NextRequest) {
  if (!isAdminAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const patch = (await request.json()) as Partial<ScoringConfig>;
  const config = await upsertScoringConfig(patch);

  return NextResponse.json({ ok: true, config });
}
