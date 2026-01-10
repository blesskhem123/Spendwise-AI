# ✅ Pre-Deployment Checklist - SpendWise AI

## 🎉 What's Been Fixed

I've reviewed and improved your project for production deployment. Here's what's been updated:

### ✅ Security Improvements
- **CORS Configuration**: Now properly configured with `FRONTEND_URL` environment variable
- **JWT Secret Validation**: Added warning if default secret is used in production
- **Error Handling**: Stack traces hidden in production mode

### ✅ Configuration Improvements
- **API Base URL**: Now supports environment variable `VITE_API_URL` for different domains
- **Environment Variables**: All configurable via `.env` files

### ✅ Documentation
- **DEPLOYMENT.md**: Complete deployment guide created
- **README.md**: Updated with deployment references

---

## 📋 Before You Deploy - Required Steps

### 1. Set Environment Variables

#### Frontend `.env` (root directory):
```env
VITE_GOOGLE_CLIENT_ID=your-production-google-client-id.apps.googleusercontent.com
VITE_API_URL=/api
```

#### Backend `.env` (backend/ directory):
```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=generate-strong-random-32-char-string
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
NODE_ENV=production
```

### 2. Generate Strong JWT Secret

Run this command to generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as `JWT_SECRET` in `backend/.env`.

### 3. Configure Google OAuth for Production

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a **new OAuth Client ID** for production (separate from development)
3. Add your production URLs:
   - Authorized JavaScript origins: `https://your-frontend-domain.com`
   - Authorized redirect URIs: `https://your-frontend-domain.com`
4. Update `VITE_GOOGLE_CLIENT_ID` in frontend `.env`

### 4. Set Up MongoDB

- Use MongoDB Atlas (recommended) or your own MongoDB instance
- **See [MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md) for complete step-by-step guide**
- Get connection string and set `MONGODB_URI` in `backend/.env`
- Whitelist your server IP in MongoDB Atlas

### 5. Test Production Build

```bash
# Frontend
npm run build
npm run preview  # Test the build locally

# Backend
cd backend
npm start  # Test backend starts correctly
```

---

## ✅ Final Checklist

Before deploying, verify:

- [ ] All environment variables set (frontend and backend)
- [ ] Strong JWT secret generated and set
- [ ] MongoDB connection string configured
- [ ] Google OAuth production Client ID created and configured
- [ ] `FRONTEND_URL` set to your production frontend domain
- [ ] `NODE_ENV=production` set in backend `.env`
- [ ] Production build tested locally (`npm run build` and `npm run preview`)
- [ ] Backend starts successfully with production config
- [ ] All features tested (signup, login, Google OAuth, CRUD operations)

---

## 🚀 Ready to Deploy!

Once all checklist items are complete, you're ready to deploy! 

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for various platforms.

---

## 🔒 Security Reminders

- ✅ Never commit `.env` files (already in `.gitignore`)
- ✅ Use different Google OAuth Client IDs for dev and production
- ✅ Use strong, unique JWT secrets
- ✅ Enable HTTPS in production
- ✅ Restrict CORS to your frontend domain only
- ✅ Keep dependencies updated

---

**Everything else is ready! Good luck with your deployment! 🎉**

