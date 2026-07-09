export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const VALID_CATEGORIES = ['postgraduate', 'house_officer', 'mbbs'];
const VALID_TYPES = ['curriculum', 'schedule', 'guide', 'announcement', 'video', 'document'];

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS program_content (
      id INT AUTO_INCREMENT PRIMARY KEY,
      program_category ENUM('postgraduate','house_officer','mbbs') NOT NULL,
      type ENUM('curriculum','schedule','guide','announcement','video','document') NOT NULL DEFAULT 'document',
      title VARCHAR(255) NOT NULL,
      content TEXT,
      link VARCHAR(1000),
      author VARCHAR(100) NOT NULL DEFAULT 'Admin',
      author_avatar VARCHAR(20) DEFAULT '👤',
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

export async function GET(request) {
  try {
    await ensureTable();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    let sql = 'SELECT * FROM program_content';
    const params = [];
    const conditions = [];
    if (category && VALID_CATEGORIES.includes(category)) { conditions.push('program_category = ?'); params.push(category); }
    if (type && VALID_TYPES.includes(type)) { conditions.push('type = ?'); params.push(type); }
    if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY created_at DESC';
    const [rows] = await pool.query(sql, params);
    return NextResponse.json({ success: true, content: rows });
  } catch (error) {
    console.error('GET programs error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await ensureTable();
    const user = verifyToken(request);
    if (!user || user.role !== 'admin') return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 401 });
    const body = await request.json();
    if (!body.program_category || !VALID_CATEGORIES.includes(body.program_category)) return NextResponse.json({ success: false, message: 'Invalid program category' }, { status: 400 });
    if (!body.title?.trim()) return NextResponse.json({ success: false, message: 'Title is required' }, { status: 400 });
    const [result] = await pool.query(
      'INSERT INTO program_content (program_category, type, title, content, link, author, author_avatar, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [body.program_category, VALID_TYPES.includes(body.type) ? body.type : 'document', body.title.trim(), body.content || '', body.link || null, body.author || 'Admin', body.author_avatar || '👤', user.id]
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
    const [result] = await pool.query('DELETE FROM program_content WHERE id = ?', [id]);
    if (result.affectedRows === 0) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete' }, { status: 500 });
  }
}
