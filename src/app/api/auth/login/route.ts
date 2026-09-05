import { NextRequest, NextResponse } from 'next/server';
import { getAdminPasswordHash } from '@/lib/db';
import { verifyPassword, createSessionToken, AUTH_COOKIE_CONFIG, getAuthCookieOptions } from '@/lib/auth';

// Simple in-memory brute-force throttle
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_ATTEMPTS) return false;

  record.count++;
  return true;
}

function resetRateLimit(ip: string) {
  loginAttempts.delete(ip);
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many login attempts. Try again in 15 minutes.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const cleanUser = username.trim().toLowerCase();
    if (cleanUser !== 'weiyu85' && cleanUser !== 'admin') {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const currentHash = await getAdminPasswordHash();
    const isValid = await verifyPassword(password, currentHash);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    resetRateLimit(ip);
    const token = await createSessionToken('weiyu85');

    const response = NextResponse.json({
      success: true,
      user: { username: 'weiyu85', role: 'admin' },
    });

    response.cookies.set(AUTH_COOKIE_CONFIG.name, token, getAuthCookieOptions(request));
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
