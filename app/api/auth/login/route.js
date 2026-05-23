// app/api/auth/login/route.js
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(request) {
  let connection;
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Please provide email and password' 
        },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();

    // Check if user exists and get role from database
    const [users] = await connection.query(
      'SELECT id, name, email, phone, password, role FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      connection.release();
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid credentials. User not found.' 
        },
        { status: 401 }
      );
    }

    const user = users[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      connection.release();
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email or password' 
        },
        { status: 401 }
      );
    }

    // Generate JWT token with role from database
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    connection.release();

    // Return response with role from database
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role, // Role directly from MySQL database
      },
    });
  } catch (error) {
    if (connection) connection.release();
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Server error during login',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
