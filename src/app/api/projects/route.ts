import { NextRequest, NextResponse } from 'next/server';
import { getProjects, createProject } from '@/lib/db';
import { verifyApiAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const device = searchParams.get('device');
    const search = searchParams.get('search')?.toLowerCase();
    const featured = searchParams.get('featured');

    let projects = await getProjects();

    if (device && device !== 'all') {
      projects = projects.filter((p) => p.device === device);
    }

    if (featured === 'true') {
      projects = projects.filter((p) => p.featured);
    }

    if (search) {
      projects = projects.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.subtitle.toLowerCase().includes(search) ||
          p.overview.toLowerCase().includes(search) ||
          p.device.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error('Failed to get projects:', error);
    return NextResponse.json({ error: 'Failed to retrieve projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuth = await verifyApiAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized: Admin login required' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.title || !body.heroImage) {
      return NextResponse.json(
        { error: 'Missing required project fields: title and heroImage are required' },
        { status: 400 }
      );
    }

    const newProject = await createProject({
      title: body.title,
      subtitle: body.subtitle || '',
      slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      device: body.device || 'PC / Desktop',
      heroImage: body.heroImage,
      thumbnailImage: body.thumbnailImage || body.heroImage,
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : [body.heroImage],
      overview: body.overview || '',
      featured: Boolean(body.featured),
    });

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (error) {
    console.error('Failed to create project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
