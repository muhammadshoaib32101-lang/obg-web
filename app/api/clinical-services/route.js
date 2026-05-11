import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS clinical_services (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      icon_name VARCHAR(50) DEFAULT 'Clock',
      sort_order INT DEFAULT 0
    )
  `);
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM clinical_services');
  if (rows[0].count === 0) {
    await pool.query(`
      INSERT INTO clinical_services (title, description, icon_name, sort_order) VALUES
      ('Antenatal Care', 'Comprehensive pregnancy monitoring and prenatal checkups', 'Clock', 0),
      ('Gynecology OPD', 'Expert consultation for all gynecological conditions', 'Users', 1),
      ('Labor & Delivery', 'Modern labor rooms with 24/7 specialist availability', 'Award', 2),
      ('Emergency Services', 'Round-the-clock emergency obstetric care', 'Shield', 3)
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
    const [rows] = await pool.query('SELECT * FROM clinical_services ORDER BY sort_order ASC, id ASC');
    return NextResponse.json({ success: true, services: rows });
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
      'UPDATE clinical_services SET title=?, description=?, icon_name=?, sort_order=? WHERE id=?',
      [body.title?.trim(), body.description || '', body.icon_name || 'Clock', body.sort_order ?? 0, body.id]
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
    if (!body.title?.trim()) return NextResponse.json({ success: false, message: 'Title required' }, { status: 400 });
    const [result] = await pool.query(
      'INSERT INTO clinical_services (title, description, icon_name, sort_order) VALUES (?, ?, ?, ?)',
      [body.title.trim(), body.description || '', body.icon_name || 'Clock', body.sort_order ?? 99]
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
    await pool.query('DELETE FROM clinical_services WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete' }, { status: 500 });
  }
}
