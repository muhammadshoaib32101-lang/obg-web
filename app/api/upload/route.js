export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const ALLOWED_MIME = {
  'application/pdf':                                                              'pdf',
  'video/mp4':                                                                    'mp4',
  'video/webm':                                                                   'webm',
  'video/quicktime':                                                              'mov',
  'video/x-msvideo':                                                              'avi',
  'image/jpeg':                                                                   'jpg',
  'image/png':                                                                    'png',
  'image/gif':                                                                    'gif',
  'image/webp':                                                                   'webp',
  'application/vnd.ms-powerpoint':                                                'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':   'pptx',
  'application/msword':                                                           'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':     'docx',
  'text/plain':                                                                   'txt',
};

const MAX_SIZE = 500 * 1024 * 1024; // 500 MB

function verifyToken(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;
    return jwt.verify(authHeader.substring(7), JWT_SECRET);
  } catch { return null; }
}

export async function POST(request) {
  try {
    const user = verifyToken(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    if (bytes.byteLength > MAX_SIZE) {
      return NextResponse.json({ success: false, message: 'File too large (max 500 MB)' }, { status: 400 });
    }

    const mimeType = file.type;
    if (!ALLOWED_MIME[mimeType]) {
      return NextResponse.json({ success: false, message: `File type not allowed: ${mimeType}` }, { status: 400 });
    }

    // Sanitise filename and ensure correct extension
    const ext = ALLOWED_MIME[mimeType];
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\.[^.]+$/, '');
    const filename = `${Date.now()}-${safeName}.${ext}`;

    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(join(uploadsDir, filename), Buffer.from(bytes));

    return NextResponse.json({
      success: true,
      filename,
      url: `/uploads/${filename}`,
      originalName: file.name,
      mimeType,
      size: bytes.byteLength,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
