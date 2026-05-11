import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const VALID_PLATFORMS = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'whatsapp'];

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS social_links (
      id INT AUTO_INCREMENT PRIMARY KEY,
      platform ENUM('facebook','twitter','instagram','linkedin','youtube','whatsapp') NOT NULL,
      url VARCHAR(500) NOT NULL,
      sort_order INT DEFAULT 0
    )
  `);
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM social_links');
  if (rows[0].count === 0) {
    await pool.query(`
      INSERT INTO social_links (platform, url, sort_order) VALUES
      ('facebook', '#', 0),
      ('twitter', '#', 1),
      ('instagram', '#', 2),
      ('linkedin', '#', 3)
    `);
  }
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
    const [rows] = await pool.query('SELECT * FROM social_links ORDER BY sort_order ASC, id ASC');
    return NextResponse.json({ success: true, links: rows });
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
    if (!body.platform || !VALID_PLATFORMS.includes(body.platform)) return NextResponse.json({ success: false, message: 'Invalid platform' }, { status: 400 });
    if (!body.url?.trim()) return NextResponse.json({ success: false, message: 'URL required' }, { status: 400 });
    const [result] = await pool.query(
      'INSERT INTO social_links (platform, url, sort_order) VALUES (?, ?, ?)',
      [body.platform, body.url.trim(), body.sort_order ?? 99]
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
      'UPDATE social_links SET platform=?, url=?, sort_order=? WHERE id=?',
      [VALID_PLATFORMS.includes(body.platform) ? body.platform : 'facebook', body.url?.trim() || '#', body.sort_order ?? 0, body.id]
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
    await pool.query('DELETE FROM social_links WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete' }, { status: 500 });
  }
}
