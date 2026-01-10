# 🚀 Deployment Guide - SpendWise AI

Complete guide for deploying SpendWise AI to production.

## 📋 Pre-Deployment Checklist

### ✅ Critical Requirements

1. **Environment Variables** - All required variables must be set
2. **MongoDB** - Production database configured
3. **Google OAuth** - Production Client ID configured
4. **Security** - JWT secret and CORS properly configured
5. **Build** - Frontend built and tested

---

## 🔧 Environment Variables Setup

### Frontend `.env` (Root Directory)

Create `.env` file in the project root:

```env
# Google OAuth Client ID (REQUIRED)
VITE_GOOGLE_CLIENT_ID=your-production-client-id.apps.googleusercontent.com

# API Base URL (OPTIONAL - only if backend is on different domain)
# For same-domain: leave as default '/api'
# For different domain: VITE_API_URL=https://api.yourdomain.com/api
VITE_API_URL=/api
```

### Backend `.env` (backend/ Directory)

Create `.env` file in the `backend/` directory:

```env
# MongoDB Connection String (REQUIRED)
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/spendwise-ai?retryWrites=true&w=majority
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/spendwise-ai

# JWT Secret Key (REQUIRED - Generate strong random string)
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Server Port (default: 5000)
PORT=5000

# Frontend URL (for CORS - REQUIRED in production)
FRONTEND_URL=https://your-frontend-domain.com

# Node Environment
NODE_ENV=production
```

---

## 🔐 Security Configuration

### 1. Generate Strong JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and set it as `JWT_SECRET` in `backend/.env`.

### 2. Configure CORS

The backend automatically configures CORS based on `FRONTEND_URL` environment variable. Make sure to set it in production.

### 3. Google OAuth Production Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a **separate OAuth Client ID** for production
3. Add production URLs:
   - **Authorized JavaScript origins**: `https://your-frontend-domain.com`
   - **Authorized redirect URIs**: `https://your-frontend-domain.com`
4. Update `VITE_GOOGLE_CLIENT_ID` in frontend `.env`

---

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Create database user
4. Whitelist your server IP (or `0.0.0.0/0` for development)
5. Get connection string and update `MONGODB_URI` in `backend/.env`

---

## 🏗️ Build Process

### Frontend Build

```bash
# Install dependencies (if not already done)
npm install

# Build for production
npm run build

# Test production build locally
npm run preview
```

The build output will be in the `dist/` folder.

### Backend

No build step needed. Just ensure:
- All dependencies installed: `cd backend && npm install`
- Environment variables set in `backend/.env`
- Server can start: `npm start`

---

## 📦 Deployment Options

### Option 1: Same Domain (Recommended for Start)

**Frontend and Backend on same domain:**
- Frontend: `https://yourdomain.com` (serves `dist/` folder)
- Backend: `https://yourdomain.com/api` (proxied or subdirectory)

**Configuration:**
- Frontend `.env`: `VITE_API_URL=/api` (default)
- Backend CORS: `FRONTEND_URL=https://yourdomain.com`

### Option 2: Different Domains

**Frontend and Backend on different domains:**
- Frontend: `https://yourdomain.com`
- Backend: `https://api.yourdomain.com`

**Configuration:**
- Frontend `.env`: `VITE_API_URL=https://api.yourdomain.com/api`
- Backend CORS: `FRONTEND_URL=https://yourdomain.com`

---

## 🚀 Deployment Platforms

### Vercel (Frontend)

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. Add environment variables in Vercel dashboard
4. Build command: `npm run build`
5. Output directory: `dist`

### Netlify (Frontend)

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Railway / Render / Heroku (Backend)

1. Connect GitHub repository
2. Set root directory to `backend/`
3. Add all environment variables
4. Build command: (none needed)
5. Start command: `npm start`

### DigitalOcean / AWS / Azure

Follow platform-specific Node.js deployment guides. Ensure:
- Node.js 18+ installed
- PM2 or similar process manager for backend
- Nginx or similar reverse proxy for frontend
- SSL certificates configured

---

## ✅ Post-Deployment Checklist

- [ ] Frontend accessible at production URL
- [ ] Backend API accessible (test: `https://your-api.com/api/health`)
- [ ] MongoDB connection working
- [ ] User signup/login working
- [ ] Google OAuth working
- [ ] All CRUD operations working (transactions, budgets, goals)
- [ ] CORS configured correctly
- [ ] Environment variables set correctly
- [ ] SSL/HTTPS enabled
- [ ] Error handling working (no stack traces exposed)

---

## 🐛 Troubleshooting

### Backend not connecting to MongoDB

- Check `MONGODB_URI` is correct
- Verify MongoDB Atlas IP whitelist includes your server IP
- Check MongoDB connection string format

### CORS errors

- Verify `FRONTEND_URL` in backend `.env` matches your frontend domain
- Check that frontend URL includes protocol (`https://`)
- Ensure no trailing slashes

### Google OAuth not working

- Verify production Client ID is set in frontend `.env`
- Check Google Cloud Console has production URLs configured
- Ensure OAuth consent screen is published (not just in testing)

### API calls failing

- Check `VITE_API_URL` in frontend `.env`
- Verify backend is running and accessible
- Check browser console for specific errors

### JWT errors

- Ensure `JWT_SECRET` is set and strong (32+ characters)
- Verify same secret is used consistently
- Check token expiration (currently 30 days)

---

## 📚 Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Express.js Production Best Practices](https://expressjs.com/en/advanced/best-practice-production.html)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Google OAuth Setup](GOOGLE_AUTH_SETUP.md)

---

## 🔒 Security Reminders

1. **Never commit `.env` files** to git (already in `.gitignore`)
2. **Use strong JWT secrets** (32+ random characters)
3. **Enable HTTPS** in production
4. **Restrict CORS** to your frontend domain only
5. **Use MongoDB Atlas** with proper authentication
6. **Keep dependencies updated** regularly
7. **Monitor logs** for suspicious activity

---

**Good luck with your deployment! 🎉**


