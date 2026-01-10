# Google OAuth Setup - Step-by-Step Visual Guide

Based on the Google Cloud Console interface you're seeing, here's exactly what to do:

## 🎯 Current Step: Create OAuth Client

You're on the **OAuth Overview** page. Here's what to do:

### Step 1: Click "Create OAuth client" Button
- You should see a gray information box saying: "You haven't configured any OAuth clients for this project yet"
- Click the **"Create OAuth client"** button on the right side of that box

### Step 2: Configure OAuth Client

After clicking, you'll see a form to configure your OAuth client:

1. **Application type**: Select **"Web application"**

2. **Name**: Give it a name like:
   - `SpendWise AI Web Client`
   - `SpendWise AI Development`

3. **Authorized JavaScript origins**:
   - Click **"+ ADD URI"**
   - Add: `http://localhost:3000`
   - (For production later, you'll add your production URL)

4. **Authorized redirect URIs**:
   - Click **"+ ADD URI"**  
   - Add: `http://localhost:3000`
   - (For production later, you'll add your production URL)

5. **Click "CREATE"** button

### Step 3: Copy Your Client ID

After creation, you'll see:
- **Client ID** (looks like: `123456789-abc123def456.apps.googleusercontent.com`)
- **Client secret** (you don't need this for now)

**IMPORTANT**: Copy the **Client ID** - you'll need it for your `.env` file!

### Step 4: Add to Your Project

1. Go back to your project folder
2. Create a `.env` file in the root directory (if it doesn't exist)
3. Add this line:
   ```
   VITE_GOOGLE_CLIENT_ID=paste-your-client-id-here
   ```
   Replace `paste-your-client-id-here` with the Client ID you just copied

4. Save the file

### Step 5: Restart Your Development Server

```bash
# Stop the server (Ctrl+C if running)
# Then restart
npm run dev
```

---

## 📝 Important Notes

### About the OAuth Consent Screen

You might also need to configure the **OAuth consent screen** first. If you haven't done that:

1. In the left sidebar, look for **"Branding"** or **"Audience"** 
2. Or go to: **APIs & Services** → **OAuth consent screen** (older interface)
3. Fill in:
   - App name: `SpendWise AI`
   - User support email: Your email
   - Developer contact: Your email
4. Add scopes: `email`, `profile`, `openid`
5. Save

### Navigation Tips

- If you're in the new "Google Auth Platform" interface, you can also use the left sidebar:
  - **Clients** - Where you'll see your created OAuth clients
  - **Branding** - For OAuth consent screen
  - **Audience** - For setting who can use the app

- If you prefer the older interface:
  - Go to: **APIs & Services** → **Credentials**
  - You'll see all your OAuth clients there

---

## ✅ What You Should See After Setup

Once configured, you should see:
- Your OAuth client listed in the "Clients" section
- The Client ID visible
- Status showing as "Active" or similar

---

## 🚀 Next Steps After Configuration

1. ✅ OAuth client created
2. ✅ Client ID copied to `.env` file
3. ✅ Development server restarted
4. ✅ Test Google sign-in on Login/Signup pages

---

**Need help?** If you get stuck at any step, let me know what you're seeing and I'll help you through it!









