import { NextRequest, NextResponse } from 'next/server';

import { getAdminSchools } from '@/lib/data';
import { isAdminAuthenticatedFromRequest } from '@/lib/server/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const schools = await getAdminSchools();
  return NextResponse.json({ schools });
}
