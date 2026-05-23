import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const MIME_MAP = {
  pdf:  'application/pdf',
  mp4:  'video/mp4',
  webm: 'video/webm',
  mov:  'video/quicktime',
  avi:  'video/x-msvideo',
  jpg:  'image/jpeg',
  jpeg: 'image/jpeg',
  png:  'image/png',
  gif:  'image/gif',
  webp: 'image/webp',
  ppt:  'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  doc:  'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  txt:  'text/plain; charset=utf-8',
};

function verifyAuth(request) {
  try {
    // Check cookie (set by the app on login)
    const cookie = request.headers.get('cookie') || '';
    const fromCookie = cookie.match(/userToken=([^;]+)/)?.[1];
    // Also accept Authorization header
    const auth = request.headers.get('authorization');
    const fromHeader = auth?.startsWith('Bearer ') ? auth.substring(7) : null;
    const token = fromCookie || fromHeader;
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET);
  } catch { return null; }
}

export async function GET(request, { params }) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { filename } = await params;

    // Security: block path traversal
    if (!filename || /[/\\.]\./.test(filename) || filename.includes('..')) {
      return new NextResponse('Invalid filename', { status: 400 });
    }

    const filePath = join(process.cwd(), 'uploads', filename);

    let buffer;
    try {
      buffer = await readFile(filePath);
    } catch {
      return new NextResponse('File not found', { status: 404 });
    }

    const ext = filename.split('.').pop()?.toLowerCase() ?? '';
    const mimeType = MIME_MAP[ext] ?? 'application/octet-stream';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type':        mimeType,
        // inline = render in browser, not a download prompt
        'Content-Disposition': 'inline',
        // Prevent caching so the auth check runs every time
        'Cache-Control':       'private, no-store, no-cache',
        // Prevent embedding in other origins
        'X-Frame-Options':     'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('File serve error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
