import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

/* ---------------- HELPER: VERIFY TOKEN ---------------- */
function verifyToken(request) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error('JWT error:', err);
    return null;
  }
}

/* ---------------- GET CONTENT ---------------- */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let sql = 'SELECT * FROM content';
    let params = [];

    if (type && ['post', 'article', 'video'].includes(type)) {
      sql += ' WHERE type = ?';
      params.push(type);
    }

    sql += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(sql, params);

    return NextResponse.json({ success: true, content: rows });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

/* ---------------- CREATE CONTENT ---------------- */
export async function POST(request) {
  try {
    const user = verifyToken(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 🔧 TEMPORARILY ALLOW ALL LOGGED-IN USERS
    // comment this back later if needed
    /*
    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }
    */

    const body = await request.json();
    console.log('REQUEST BODY:', body);
    console.log('USER:', user);

    // ✅ SAFE DEFAULTS
    const type = body.type && ['post', 'article', 'video'].includes(body.type)
      ? body.type
      : 'article';

    const author = body.author || 'Unknown';
    const authorAvatar = body.authorAvatar || '👤';
    const title = body.title || 'Untitled';
    const content = body.content || '';
    const link = body.link || null;
    const videoId = body.videoId || null;
    const createdBy = user.id || 1;

    const [result] = await pool.query(
      `INSERT INTO content
       (type, author, author_avatar, title, content, link, video_id, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        type,
        author,
        authorAvatar,
        title,
        content,
        link,
        videoId,
        createdBy
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Content created successfully',
      contentId: result.insertId
    });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* ---------------- DELETE CONTENT ---------------- */
export async function DELETE(request) {
  try {
    const user = verifyToken(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Content ID is required' },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      'DELETE FROM content WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully'
    });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete content' },
      { status: 500 }
    );
  }
}
