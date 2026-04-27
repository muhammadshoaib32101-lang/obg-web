# OBGYN HITEC-IMS Web Application

A Next.js application for the Department of Obstetrics & Gynecology at HITEC Institute of Medical Sciences.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MySQL Database
- npm or yarn

### Installation

1. **Clone or download the project**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file in the root directory:**
   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=your_database_name
   JWT_SECRET=your-random-secret-key
   ADMIN_SECRET_KEY=your-admin-secret-key
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Frontend: http://localhost:3000
   - API Health: http://localhost:3000/api/health

## 📁 Project Structure

```
Obg/
├── app/
│   ├── api/              # Next.js API Routes
│   │   ├── auth/        # Authentication endpoints
│   │   └── health/      # Health check
│   ├── Components/      # React Components
│   └── page.tsx         # Main page
├── lib/
│   └── db.js           # MySQL connection pool
└── public/             # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/create-admin` - Create admin (requires secret key)
- `GET /api/health` - Health check

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed Hostinger deployment instructions.

## 🛠️ Technologies

- **Next.js 16** - React framework with App Router
- **MySQL** - Database
- **Tailwind CSS** - Styling
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📝 Notes

- Database tables are created automatically on first API call
- All API routes use Next.js App Router format
- Frontend uses relative API paths (no CORS needed)
