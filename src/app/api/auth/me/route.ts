import { NextRequest, NextResponse } from 'next/server';
import { verifyApiAuth, getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const isAuth = await verifyApiAuth(request);
  if (!isAuth) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const session = await getSession();
  return NextResponse.json({
    authenticated: true,
    user: session || { username: 'admin', role: 'admin' },
  });
}
