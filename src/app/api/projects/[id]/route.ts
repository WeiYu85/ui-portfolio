import { NextRequest, NextResponse } from 'next/server';
import { getProjectById, getProjectBySlug, updateProject, deleteProject } from '@/lib/db';
import { verifyApiAuth } from '@/lib/auth';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    // Check by ID or slug
    let project = await getProjectById(id);
    if (!project) {
      project = await getProjectBySlug(id);
    }

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Failed to get project:', error);
    return NextResponse.json({ error: 'Failed to retrieve project' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const isAuth = await verifyApiAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized: Admin login required' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const updated = await updateProject(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Project not found for update' }, { status: 404 });
    }

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    console.error('Failed to update project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const isAuth = await verifyApiAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized: Admin login required' }, { status: 401 });
    }

    const { id } = await context.params;
    const deleted = await deleteProject(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Project not found for deletion' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Failed to delete project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
