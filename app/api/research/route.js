export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const VALID_TYPES = ['research', 'publication', 'thesis', 'conference'];

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS research_publications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      authors VARCHAR(500) NOT NULL,
      journal_name VARCHAR(255),
      year VARCHAR(10),
      abstract TEXT,
      link VARCHAR(1000),
      file_url VARCHAR(1000),
      type ENUM('research','publication','thesis','conference') DEFAULT 'publication',
      created_by INT,
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
    const [rows] = await pool.query('SELECT * FROM research_publications ORDER BY created_at DESC');
    return NextResponse.json({ success: true, research: rows });
  } catch (error) {
    console.error('GET research error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await ensureTable();
    const user = verifyToken(request);
    if (!user || user.role !== 'admin') return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 401 });
    const body = await request.json();
    if (!body.title?.trim()) return NextResponse.json({ success: false, message: 'Title is required' }, { status: 400 });
    if (!body.authors?.trim()) return NextResponse.json({ success: false, message: 'Authors are required' }, { status: 400 });
    const [result] = await pool.query(
      'INSERT INTO research_publications (title, authors, journal_name, year, abstract, link, file_url, type, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [body.title.trim(), body.authors.trim(), body.journal_name || null, body.year || null, body.abstract || null, body.link || null, body.file_url || null, VALID_TYPES.includes(body.type) ? body.type : 'publication', user.id]
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
    const [result] = await pool.query('DELETE FROM research_publications WHERE id = ?', [id]);
    if (result.affectedRows === 0) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete' }, { status: 500 });
  }
}
