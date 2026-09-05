import { NextRequest, NextResponse } from 'next/server';
import { getProfile, updateProfile, updateAdminPasswordHash } from '@/lib/db';
import { verifyApiAuth, hashPassword } from '@/lib/auth';

export async function GET() {
  try {
    const profile = await getProfile();
    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Failed to get profile:', error);
    return NextResponse.json({ error: 'Failed to retrieve profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAuth = await verifyApiAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized: Admin login required' }, { status: 401 });
    }

    const body = await request.json();

    // If new password requested
    if (body.newPassword && typeof body.newPassword === 'string' && body.newPassword.length >= 6) {
      const hashed = await hashPassword(body.newPassword);
      await updateAdminPasswordHash(hashed);
      delete body.newPassword;
    }

    const updated = await updateProfile(body);
    return NextResponse.json({ success: true, profile: updated });
  } catch (error) {
    console.error('Failed to update profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
