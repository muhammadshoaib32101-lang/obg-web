import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS homepage_gallery (
      id INT AUTO_INCREMENT PRIMARY KEY,
      image_url VARCHAR(500) NOT NULL,
      caption VARCHAR(255),
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

function verifyToken(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    return jwt.verify(authHeader.substring(7), JWT_SECRET);
  } catch { return null; }
}

export async function GET() {
  try {
    await ensureTable();
    const [rows] = await pool.query('SELECT * FROM homepage_gallery ORDER BY sort_order ASC, created_at ASC');
    return NextResponse.json({ success: true, images: rows });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await ensureTable();
    const user = verifyToken(request);
    if (!user || user.role !== 'admin') return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 401 });
    const body = await request.json();
    if (!body.image_url?.trim()) return NextResponse.json({ success: false, message: 'image_url required' }, { status: 400 });
    const [result] = await pool.query(
      'INSERT INTO homepage_gallery (image_url, caption, sort_order) VALUES (?, ?, ?)',
      [body.image_url.trim(), body.caption || '', body.sort_order || 0]
    );
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = verifyToken(request);
    if (!user || user.role !== 'admin') return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });
    await pool.query('DELETE FROM homepage_gallery WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete' }, { status: 500 });
  }
}
