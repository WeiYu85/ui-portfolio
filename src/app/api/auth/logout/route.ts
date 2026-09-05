import { NextResponse } from 'next/server';
import { AUTH_COOKIE_CONFIG, getAuthCookieOptions } from '@/lib/auth';

export async function POST(request: Request) {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.set(AUTH_COOKIE_CONFIG.name, '', {
    ...getAuthCookieOptions(request),
    maxAge: 0,
  });
  return response;
}
