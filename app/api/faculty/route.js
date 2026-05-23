import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS faculty (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      role_title VARCHAR(100) NOT NULL,
      credentials VARCHAR(255),
      experience_note VARCHAR(255),
      image_url VARCHAR(500),
      is_hod BOOLEAN DEFAULT FALSE,
      sort_order INT DEFAULT 99,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM faculty');
  if (rows[0].count === 0) {
    await pool.query(`
      INSERT INTO faculty (name, role_title, credentials, experience_note, is_hod, sort_order) VALUES
      ('Professor Dr Fehmida Shaheen', 'Head of Department', 'MBBS, MCPS, FCPS', '35+ years experience · Renowned Professor', 1, 0),
      ('Prof Dr Mahwash Jamil', 'Professor', 'MBBS, MCPS, FCPS, MHPE', NULL, 0, 1),
      ('Dr. Ayesha Akram', 'Associate Professor', 'MBBS, FCPS', NULL, 0, 2),
      ('Dr. Adeela Amin', 'Assistant Professor', 'MBBS, FCPS', NULL, 0, 3),
      ('Dr. Tanzeela Aftab', 'Assistant Professor', 'MBBS, FCPS', NULL, 0, 4),
      ('Dr. Tahira Jabeen', 'Assistant Professor', 'MBBS, FCPS', NULL, 0, 5),
      ('Major Dr. Sahar Ahsan', 'Assistant Professor', 'MBBS, FCPS', NULL, 0, 6),
      ('Dr. Nida Khan', 'Senior Registrar', 'MBBS', NULL, 0, 7)
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
    const [rows] = await pool.query('SELECT * FROM faculty ORDER BY is_hod DESC, sort_order ASC, id ASC');
    return NextResponse.json({ success: true, faculty: rows });
  } catch (error) {
    console.error('GET faculty error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch faculty' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await ensureTable();
    const user = verifyToken(request);
    if (!user || user.role !== 'admin') return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 401 });
    const body = await request.json();
    if (!body.name?.trim() || !body.role_title?.trim()) return NextResponse.json({ success: false, message: 'Name and role are required' }, { status: 400 });
    const [result] = await pool.query(
      'INSERT INTO faculty (name, role_title, credentials, experience_note, image_url, is_hod, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [body.name.trim(), body.role_title.trim(), body.credentials || '', body.experience_note || null, body.image_url || null, body.is_hod ? 1 : 0, body.sort_order ?? 99]
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
      'UPDATE faculty SET name=?, role_title=?, credentials=?, experience_note=?, image_url=?, is_hod=?, sort_order=? WHERE id=?',
      [body.name?.trim(), body.role_title?.trim(), body.credentials || '', body.experience_note || null, body.image_url || null, body.is_hod ? 1 : 0, body.sort_order ?? 99, body.id]
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
    await pool.query('DELETE FROM faculty WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete' }, { status: 500 });
  }
}
