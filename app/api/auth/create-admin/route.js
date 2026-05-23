// app/api/auth/create-admin/route.js
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
  let connection;
  try {
    const body = await request.json();
    const { name, email, password, secretKey } = body;

    // Secret key to prevent unauthorized admin creation
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Unauthorized' 
        },
        { status: 403 }
      );
    }

    connection = await pool.getConnection();

    // Check if admin already exists
    const [existingAdmins] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingAdmins.length > 0) {
      connection.release();
      return NextResponse.json(
        { 
          success: false, 
          message: 'Admin already exists' 
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin
    const [result] = await connection.query(
      'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, null, hashedPassword, 'admin']
    );

    const adminId = result.insertId;

    connection.release();

    return NextResponse.json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        id: adminId,
        name: name,
        email: email,
        role: 'admin',
      },
    }, { status: 201 });
  } catch (error) {
    if (connection) connection.release();
    console.error('Create admin error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Server error during admin creation',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
