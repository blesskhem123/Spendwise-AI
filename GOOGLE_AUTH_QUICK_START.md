# Google Authentication - Quick Start

## ✅ What's Been Added

Google OAuth authentication has been successfully integrated into SpendWise AI! Users can now sign in using their Google account.

## 🚀 Quick Setup (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Get Google Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or use existing)
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add `http://localhost:3000` to authorized origins
7. Copy the **Client ID**

### Step 3: Add to Environment File

Create a `.env` file in the project root:
```env
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

Replace `your-client-id-here` with your actual Client ID.

### Step 4: Restart Server
```bash
npm run dev
```

## 🎯 Where to Find Google Sign-In

- **Login Page**: "Sign in with Google" button (below the form)
- **Signup Page**: "Sign up with Google" button (below the form)

## ⚙️ Backend Requirement

Your backend needs to handle the `/api/auth/google` endpoint. See `GOOGLE_AUTH_SETUP.md` for detailed backend implementation.

## 📚 Full Documentation

For complete setup instructions, see: **GOOGLE_AUTH_SETUP.md**

---

**That's it! Google authentication is ready to use! 🎉**










