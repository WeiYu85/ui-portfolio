import { NextRequest, NextResponse } from 'next/server';
import { saveContactMessage, getContactMessages, updateMessageStatus, deleteContactMessage } from '@/lib/db';
import { verifyApiAuth } from '@/lib/auth';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }
    if (name.length > 100) {
      return NextResponse.json({ error: 'Name must be 100 characters or fewer' }, { status: 400 });
    }
    if (email.length > 254 || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: 'Message must be 5000 characters or fewer' }, { status: 400 });
    }

    const saved = await saveContactMessage({
      name,
      email,
      studio: typeof body.studio === 'string' ? body.studio.trim().substring(0, 200) : 'Independent / Confidential',
      discordUsername: typeof body.discordUsername === 'string' ? body.discordUsername.trim().substring(0, 50) : undefined,
      projectType: typeof body.projectType === 'string' ? body.projectType.trim().substring(0, 100) : 'Full Game UI',
      budget: typeof body.budget === 'string' ? body.budget.trim().substring(0, 50) : '$5k - $15k',
      message,
    });

    return NextResponse.json({ success: true, message: 'Message sent successfully', data: saved });
  } catch {
    return NextResponse.json({ error: 'Failed to submit contact request' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAuth = await verifyApiAuth(request);
    if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await request.json();
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Inquiry id is required' }, { status: 400 });
    }

    const deleted = await deleteContactMessage(id);
    if (!deleted) return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const isAuth = await verifyApiAuth(request);
    if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const messages = await getContactMessages();
    return NextResponse.json({ success: true, messages });
  } catch {
    return NextResponse.json({ error: 'Failed to retrieve messages' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAuth = await verifyApiAuth(request);
    if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id, status } = await request.json();
    const updated = await updateMessageStatus(id, status);
    return NextResponse.json({ success: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to update message status' }, { status: 500 });
  }
}
