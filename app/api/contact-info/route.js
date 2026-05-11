import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_info (
      id INT AUTO_INCREMENT PRIMARY KEY,
      type ENUM('phone','email','address','other') NOT NULL DEFAULT 'other',
      label VARCHAR(100),
      value VARCHAR(500) NOT NULL,
      sort_order INT DEFAULT 0
    )
  `);
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM contact_info');
  if (rows[0].count === 0) {
    await pool.query(`
      INSERT INTO contact_info (type, label, value, sort_order) VALUES
      ('phone', 'Phone', '+92 51 111 111 111', 0),
      ('email', 'Email', 'info@hitecims.edu.pk', 1),
      ('address', 'Address', 'HITEC Institute of Medical Sciences, Taxila, Punjab, Pakistan', 2)
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
    const [rows] = await pool.query('SELECT * FROM contact_info ORDER BY sort_order ASC, id ASC');
    return NextResponse.json({ success: true, contacts: rows });
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
    if (!body.value?.trim()) return NextResponse.json({ success: false, message: 'Value required' }, { status: 400 });
    const [result] = await pool.query(
      'INSERT INTO contact_info (type, label, value, sort_order) VALUES (?, ?, ?, ?)',
      [['phone','email','address','other'].includes(body.type) ? body.type : 'other', body.label || '', body.value.trim(), body.sort_order ?? 99]
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
      'UPDATE contact_info SET type=?, label=?, value=?, sort_order=? WHERE id=?',
      [['phone','email','address','other'].includes(body.type) ? body.type : 'other', body.label || '', body.value?.trim() || '', body.sort_order ?? 0, body.id]
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
    await pool.query('DELETE FROM contact_info WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete' }, { status: 500 });
  }
}
