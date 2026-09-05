import { NextRequest, NextResponse } from 'next/server';
import { reorderProjects } from '@/lib/db';
import { verifyApiAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const isAuth = await verifyApiAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized: Admin login required' }, { status: 401 });
    }

    const { ids } = await request.json();
    if (!Array.isArray(ids)) {
      return NextResponse.json({ error: 'Array of project IDs required' }, { status: 400 });
    }

    const projects = await reorderProjects(ids);
    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error('Failed to reorder projects:', error);
    return NextResponse.json({ error: 'Failed to reorder projects' }, { status: 500 });
  }
}
