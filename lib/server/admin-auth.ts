import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

export const ADMIN_AUTH_COOKIE = 'admin_auth';

function getCredentialDefaults() {
  return {
    username: process.env.ADMIN_USERNAME ?? 'admin',
    password: process.env.ADMIN_PASSWORD ?? 'admin',
  };
}

export function isValidAdminLogin(username: string, password: string) {
  const creds = getCredentialDefaults();
  return username === creds.username && password === creds.password;
}

export function isAdminAuthenticatedFromRequest(request: NextRequest) {
  return request.cookies.get(ADMIN_AUTH_COOKIE)?.value === '1';
}

export async function isAdminAuthenticatedFromCookies() {
  const store = await cookies();
  return store.get(ADMIN_AUTH_COOKIE)?.value === '1';
}

export function getAdminAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  };
}
