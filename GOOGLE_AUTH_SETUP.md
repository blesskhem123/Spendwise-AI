# Google Authentication Setup Guide

This guide will walk you through setting up Google OAuth authentication for SpendWise AI.

## 📋 Prerequisites

- A Google account
- Access to Google Cloud Console

## 🚀 Step-by-Step Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **"New Project"**
4. Enter a project name (e.g., "SpendWise AI")
5. Click **"Create"**

### Step 2: Enable Google+ API

1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"** or **"People API"**
3. Click on it and click **"Enable"**

### Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** (unless you have a Google Workspace account)
3. Click **"Create"**
4. Fill in the required information:
   - **App name**: SpendWise AI
   - **User support email**: Your email
   - **Developer contact information**: Your email
5. Click **"Save and Continue"**
6. On the "Scopes" page, click **"Add or Remove Scopes"**
   - Add: `email`, `profile`, `openid`
7. Click **"Save and Continue"**
8. On "Test users" (if External), add test users if needed
9. Click **"Save and Continue"**
10. Review and click **"Back to Dashboard"**

### Step 4: Create OAuth 2.0 Client ID

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Choose **"Web application"** as the application type
4. Give it a name (e.g., "SpendWise AI Web Client")
5. **Authorized JavaScript origins**:
   - For development: `http://localhost:3000`
   - For production: Your production URL (e.g., `https://yourdomain.com`)
6. **Authorized redirect URIs**:
   - For development: `http://localhost:3000`
   - For production: Your production URL
7. Click **"Create"**
8. **Copy the Client ID** (you'll need this in the next step)

### Step 5: Configure Environment Variables

1. In your project root, create a `.env` file (copy from `.env.example`):
   ```bash
   # Copy the template
   cp .env.example .env
   ```

2. Open `.env` file and add your Google Client ID:
   ```env
   VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   ```

   Replace `your-client-id-here` with the Client ID you copied from Step 4.

3. **Important**: The `.env` file is already in `.gitignore`, so your credentials won't be committed to git.

### Step 6: Restart Development Server

After adding the environment variable, restart your development server:

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### Step 7: Test Google Sign-In

1. Open your app at `http://localhost:3000`
2. Go to Login or Signup page
3. Click **"Sign in with Google"** or **"Sign up with Google"**
4. You should see the Google sign-in popup
5. Select your Google account
6. Grant permissions
7. You should be redirected to the dashboard!

---

## 🔧 Backend Integration

Your backend needs to handle the Google authentication token. Here's what your backend endpoint should look like:

### Backend Endpoint: POST /api/auth/google

**Request Body:**
```json
{
  "token": "google-access-token-here"
}
```

**Backend Implementation Notes:**

1. **Verify the Google token** on your backend using Google's token info endpoint:
   ```
   https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=TOKEN
   ```

2. **Get user info** from Google:
   ```
   https://www.googleapis.com/oauth2/v2/userinfo?access_token=TOKEN
   ```

3. **Check if user exists** in your database by email
   - If exists: Log them in and return JWT token
   - If not: Create new user account and return JWT token

4. **Response format:**
   ```json
   {
     "token": "your-jwt-token",
     "user": {
       "_id": "user_id",
       "name": "User Name",
       "email": "user@example.com"
     }
   }
   ```

### Example Backend Code (Node.js/Express)

```javascript
// POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify token with Google
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`
    );
    
    const { email, name, picture } = response.data;
    
    // Find or create user
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user
      user = await User.create({
        email,
        name,
        profilePicture: picture,
        authProvider: 'google'
      });
    }
    
    // Generate JWT token
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    
    res.json({
      token: jwtToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid Google token' });
  }
});
```

---

## 🐛 Troubleshooting

### Issue: "Invalid client" error
**Solution:**
- Make sure the Client ID in `.env` is correct
- Check that you've enabled the Google+ API
- Verify the OAuth consent screen is configured

### Issue: "Redirect URI mismatch"
**Solution:**
- Make sure `http://localhost:3000` is added to "Authorized JavaScript origins"
- Make sure `http://localhost:3000` is added to "Authorized redirect URIs"
- Check that you're accessing the app from the exact URL specified

### Issue: Google sign-in button not showing
**Solution:**
- Check browser console for errors
- Verify `VITE_GOOGLE_CLIENT_ID` is set in `.env`
- Restart the development server after adding `.env` file
- Make sure the Client ID format is correct (ends with `.apps.googleusercontent.com`)

### Issue: Backend returns 401 or error
**Solution:**
- Check that your backend `/api/auth/google` endpoint is implemented
- Verify the backend is receiving the token
- Check backend logs for specific error messages
- Make sure you're sending the access_token (not the id_token)

### Issue: Environment variable not loading
**Solution:**
- Make sure the file is named `.env` (not `.env.local` or anything else)
- Restart the dev server after creating/editing `.env`
- Environment variables starting with `VITE_` are required for Vite
- Check that there are no spaces around the `=` sign in `.env`

---

## 🔒 Security Notes

1. **Never commit `.env` file** to git (it's already in `.gitignore`)
2. **Use different Client IDs** for development and production
3. **Always verify the token** on the backend - never trust client-side tokens
4. **Use HTTPS** in production
5. **Implement rate limiting** on your backend authentication endpoints

---

## 📚 Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [@react-oauth/google Documentation](https://www.npmjs.com/package/@react-oauth/google)
- [Google Cloud Console](https://console.cloud.google.com/)

---

## ✅ Checklist

- [ ] Google Cloud project created
- [ ] Google+ API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 Client ID created
- [ ] Authorized origins and redirect URIs set
- [ ] Client ID added to `.env` file
- [ ] Development server restarted
- [ ] Google sign-in button appears on login/signup pages
- [ ] Backend `/api/auth/google` endpoint implemented
- [ ] Successfully tested Google sign-in

---

**You're all set! 🎉**

If you encounter any issues, check the troubleshooting section or review the error messages in your browser console and backend logs.










