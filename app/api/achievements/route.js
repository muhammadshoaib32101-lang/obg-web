import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS achievements (
      id INT AUTO_INCREMENT PRIMARY KEY,
      icon_name VARCHAR(50) NOT NULL DEFAULT 'Trophy',
      number_text VARCHAR(20) NOT NULL,
      label VARCHAR(255) NOT NULL,
      sort_order INT DEFAULT 0
    )
  `);
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM achievements');
  if (rows[0].count === 0) {
    await pool.query(`
      INSERT INTO achievements (icon_name, number_text, label, sort_order) VALUES
      ('Trophy', '500+', 'Successful Deliveries/Year', 0),
      ('Users', '50+', 'Trained Residents', 1),
      ('Award', '20+', 'Faculty Members', 2),
      ('Star', '100%', 'FCPS Pass Rate', 3)
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
    const [rows] = await pool.query('SELECT * FROM achievements ORDER BY sort_order ASC, id ASC');
    return NextResponse.json({ success: true, achievements: rows });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const user = verifyToken(request);
    if (!user || user.role !== 'admin') return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 401 });
    const body = await request.json();
    if (!body.id) return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });
    await pool.query(
      'UPDATE achievements SET icon_name=?, number_text=?, label=?, sort_order=? WHERE id=?',
      [body.icon_name || 'Trophy', body.number_text?.trim() || '', body.label?.trim() || '', body.sort_order ?? 0, body.id]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await ensureTable();
    const user = verifyToken(request);
    if (!user || user.role !== 'admin') return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 401 });
    const body = await request.json();
    if (!body.number_text?.trim() || !body.label?.trim()) return NextResponse.json({ success: false, message: 'Number and label required' }, { status: 400 });
    const [result] = await pool.query(
      'INSERT INTO achievements (icon_name, number_text, label, sort_order) VALUES (?, ?, ?, ?)',
      [body.icon_name || 'Trophy', body.number_text.trim(), body.label.trim(), body.sort_order ?? 99]
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
    await pool.query('DELETE FROM achievements WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete' }, { status: 500 });
  }
}
