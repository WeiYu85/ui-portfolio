import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyApiAuth } from '@/lib/auth';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
  const isAuth = await verifyApiAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const single = formData.get('file') as File | null;

    const filesToProcess: File[] = files.length > 0 ? files : single ? [single] : [];

    if (filesToProcess.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    for (const f of filesToProcess) {
      if (!ALLOWED_MIME_TYPES.has(f.type)) {
        return NextResponse.json(
          { error: `File type not allowed: ${f.type}` },
          { status: 415 }
        );
      }
      if (f.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File exceeds 10 MB limit: ${f.name}` },
          { status: 413 }
        );
      }
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const uploadedUrls: string[] = [];

    for (const uploadedFile of filesToProcess) {
      const ext = path.extname(uploadedFile.name).toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json({ error: `Extension not allowed: ${ext}` }, { status: 415 });
      }

      const safeBase = path
        .basename(uploadedFile.name, ext)
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .substring(0, 30);
      const uniqueName = `${safeBase}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;

      const bytes = await uploadedFile.arrayBuffer();
      fs.writeFileSync(path.join(uploadsDir, uniqueName), Buffer.from(bytes));
      uploadedUrls.push(`/uploads/${uniqueName}`);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      url: uploadedUrls[0],
    });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
