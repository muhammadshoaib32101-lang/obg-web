# Deployment Guide for Hostinger

This project is now configured as a **single Next.js application** that can be deployed on Hostinger as one Node.js web app.

## ✅ What Changed

1. **Backend converted to Next.js API routes** - All Express routes are now in `app/api/`
2. **Frontend uses relative API paths** - No need for `NEXT_PUBLIC_API_URL` anymore
3. **Single package.json** - All dependencies in one place
4. **Database connection** - Shared MySQL pool in `lib/db.js`

## 📁 Project Structure

```
Obg/
├── app/
│   ├── api/                    # API Routes (replaces Express backend)
│   │   ├── auth/
│   │   │   ├── login/route.js
│   │   │   ├── signup/route.js
│   │   │   └── create-admin/route.js
│   │   └── health/route.js
│   ├── Components/             # React Components
│   └── page.tsx                # Main page
├── lib/
│   └── db.js                   # MySQL connection pool
├── package.json                 # All dependencies
└── .env                        # Environment variables
```

## 🚀 Deployment Steps on Hostinger

### 1. Create `.env` File

Create a `.env` file in the root directory with:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=u678966079_support
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=u678966079_ObgDatabase

# JWT Secret (CHANGE THIS TO A RANDOM STRING!)
JWT_SECRET=ObgJWT_Secret_2026_!@#$%^&*()_RandomString_987654321

# Admin Secret Key (CHANGE THIS TO A RANDOM STRING!)
ADMIN_SECRET_KEY=ObgAdmin_Key_2026_Secure_!@#$%^&*()
```

**Important:** Replace `YOUR_MYSQL_PASSWORD_HERE` with your actual MySQL password.

### 2. Upload Files to Hostinger

Upload **all files** from the project root to your Hostinger Node.js app directory:
- `app/` folder
- `lib/` folder
- `public/` folder
- `package.json`
- `package-lock.json`
- `next.config.ts`
- `tsconfig.json`
- `tailwind.config.js`
- `postcss.config.js` (or `.mjs`)
- `.env` file
- All other config files

**Do NOT upload:**
- `node_modules/` (will be installed on server)
- `Backend/` folder (no longer needed)
- `.next/` folder (will be generated)

### 3. Install Dependencies

In Hostinger's terminal or via their control panel:
```bash
npm install
```

### 4. Build the Application

```bash
npm run build
```

### 5. Set Start Command

In Hostinger's Node.js app settings, set the start command to:
```bash
npm start
```

### 6. Configure Environment Variables (Alternative)

If Hostinger supports environment variables in their control panel, you can set them there instead of using `.env`:
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`
- `ADMIN_SECRET_KEY`

## 🧪 Testing After Deployment

1. **Health Check:**
   - Visit: `https://yourdomain.com/api/health`
   - Should return: `{"status":"OK","message":"Server is running"}`

2. **Test Signup:**
   - Use the signup form on your website
   - Or test via Postman: `POST https://yourdomain.com/api/auth/signup`

3. **Test Login:**
   - Use the login form
   - Or test via Postman: `POST https://yourdomain.com/api/auth/login`

## 📝 Notes

- The database tables will be created automatically on first API call
- All API routes are now at `/api/*` (no separate backend server needed)
- Frontend components automatically use relative paths (`/api/auth/login`)
- No need for CORS configuration (same origin)

## 🔧 Troubleshooting

### Database Connection Issues
- Check `.env` file has correct database credentials
- Verify MySQL database exists in Hostinger
- Check database user has proper permissions

### Build Errors
- Make sure all dependencies are installed: `npm install`
- Check Node.js version (Next.js 16 requires Node 18+)

### API Routes Not Working
- Ensure you're using Next.js 16+ (App Router)
- Check that files are in `app/api/` directory
- Verify route files are named `route.js` (not `index.js`)
