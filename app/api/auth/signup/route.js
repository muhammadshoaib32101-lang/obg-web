export const dynamic = 'force-dynamic';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(request) {
  let connection;
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Please provide all required fields' 
        },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();

    // Check if user already exists
    const [existingUsers] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      connection.release();
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email already registered' 
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await connection.query(
      'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || null, hashedPassword, 'user']
    );

    const userId = result.insertId;

    // Generate JWT token
    const token = jwt.sign(
      { userId: userId, email: email, role: 'user' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    connection.release();

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        name: name,
        email: email,
        phone: phone,
        role: 'user',
      },
    }, { status: 201 });
  } catch (error) {
    if (connection) connection.release();
    console.error('Signup error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Server error during registration',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
