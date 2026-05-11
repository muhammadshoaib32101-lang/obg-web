// lib/db.js - MySQL Database Connection Pool for Next.js
import mysql from 'mysql2/promise';

// 1. Setup Next.js Global Cache for Hot-Reloading
// This prevents Next.js from creating a new 10-connection pool every time you hit Save.
const globalForMySQL = global;

const pool = globalForMySQL.mysqlPool || mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '3306'),
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'obg_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Save the pool to the global object in development
if (process.env.NODE_ENV !== 'production') {
  globalForMySQL.mysqlPool = pool;
}

// 2. Test Database Connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL Database: ' + (process.env.DB_NAME || 'obg_database'));
    connection.release();
  } catch (error) {
    console.error('❌ MySQL connection error:', error.message);
  }
}

// Initialize database connection test on module load
if (process.env.NODE_ENV !== 'test') {
  testConnection();
}

// 3. Export the pool for use in your API routes
export default pool;
