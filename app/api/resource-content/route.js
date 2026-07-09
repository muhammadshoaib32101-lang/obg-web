export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS resource_content (
      id INT AUTO_INCREMENT PRIMARY KEY,
      resource_category VARCHAR(50) NOT NULL,
      type ENUM('lecture', 'video', 'document', 'notes') NOT NULL DEFAULT 'lecture',
      title VARCHAR(255) NOT NULL,
      content TEXT,
      link VARCHAR(1000),
      video_id VARCHAR(100),
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
  } catch {
    return null;
  }
}

export async function GET(request) {
  try {
    await ensureTable();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');

    let sql = 'SELECT * FROM resource_content';
    const params = [];
    const conditions = [];

    if (category) { conditions.push('resource_category = ?'); params.push(category); }
    if (type && ['lecture', 'video', 'document', 'notes'].includes(type)) {
      conditions.push('type = ?'); params.push(type);
    }
    if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(sql, params);
    return NextResponse.json({ success: true, content: rows });
  } catch (error) {
    console.error('GET resource-content error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await ensureTable();
    const user = verifyToken(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 401 });
    }

    const body = await request.json();
    const validCategories = ['communication', 'clinical', 'history', 'osce', 'mcq', 'cases', 'lectures'];
    const validTypes = ['lecture', 'video', 'document', 'notes'];

    if (!body.resource_category || !validCategories.includes(body.resource_category)) {
      return NextResponse.json({ success: false, message: 'Invalid resource category' }, { status: 400 });
    }
    if (!body.title?.trim()) {
      return NextResponse.json({ success: false, message: 'Title is required' }, { status: 400 });
    }

    const extractYouTubeId = (url) => {
      const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
      const match = url.match(regex);
      return match ? match[1] : url;
    };

    const videoId = body.video_id ? extractYouTubeId(body.video_id) : null;

    const [result] = await pool.query(
      `INSERT INTO resource_content (resource_category, type, title, content, link, video_id, author, author_avatar, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.resource_category,
        validTypes.includes(body.type) ? body.type : 'lecture',
        body.title.trim(),
        body.content || '',
        body.link || null,
        videoId,
        body.author || 'Admin',
        body.author_avatar || '👤',
        user.id
      ]
    );

    return NextResponse.json({ success: true, message: 'Content created', contentId: result.insertId });
  } catch (error) {
    console.error('POST resource-content error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = verifyToken(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });

    const [result] = await pool.query('DELETE FROM resource_content WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, message: 'Content not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Content deleted' });
  } catch (error) {
    console.error('DELETE resource-content error:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete' }, { status: 500 });
  }
}
