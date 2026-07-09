export const dynamic = 'force-dynamic';
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
      crop_x FLOAT DEFAULT 0,
      crop_y FLOAT DEFAULT 0,
      crop_w FLOAT DEFAULT 100,
      crop_h FLOAT DEFAULT 100,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  // Migrate pre-existing tables
  for (const [col, def] of [
    ['crop_x', 'FLOAT DEFAULT 0'],
    ['crop_y', 'FLOAT DEFAULT 0'],
    ['crop_w', 'FLOAT DEFAULT 100'],
    ['crop_h', 'FLOAT DEFAULT 100'],
  ]) {
    try { await pool.query(`ALTER TABLE homepage_gallery ADD COLUMN ${col} ${def}`); } catch { /* already exists */ }
  }
  // Drop legacy column if present
  try { await pool.query(`ALTER TABLE homepage_gallery DROP COLUMN object_position`); } catch { /* didn't exist */ }
  // Backfill any NULLs left from old rows
  await pool.query(`UPDATE homepage_gallery SET crop_x=0   WHERE crop_x IS NULL`);
  await pool.query(`UPDATE homepage_gallery SET crop_y=0   WHERE crop_y IS NULL`);
  await pool.query(`UPDATE homepage_gallery SET crop_w=100 WHERE crop_w IS NULL`);
  await pool.query(`UPDATE homepage_gallery SET crop_h=100 WHERE crop_h IS NULL`);
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
      'INSERT INTO homepage_gallery (image_url, caption, crop_x, crop_y, crop_w, crop_h, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [body.image_url.trim(), body.caption || '', 0, 0, 100, 100, body.sort_order || 0]
    );
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const user = verifyToken(request);
    if (!user || user.role !== 'admin') return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 401 });
    const body = await request.json();
    if (!body.id) return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });
    await pool.query(
      'UPDATE homepage_gallery SET crop_x = ?, crop_y = ?, crop_w = ?, crop_h = ? WHERE id = ?',
      [body.crop_x ?? 0, body.crop_y ?? 0, body.crop_w ?? 100, body.crop_h ?? 100, body.id]
    );
    return NextResponse.json({ success: true });
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
