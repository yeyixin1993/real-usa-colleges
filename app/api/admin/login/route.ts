import { NextRequest, NextResponse } from 'next/server';

import { ADMIN_AUTH_COOKIE, getAdminAuthCookieOptions, isValidAdminLogin } from '@/lib/server/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { username?: string; password?: string };

  if (!body?.username || !body?.password) {
    return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
  }

  if (!isValidAdminLogin(body.username, body.password)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_AUTH_COOKIE, '1', getAdminAuthCookieOptions());
  return response;
}
