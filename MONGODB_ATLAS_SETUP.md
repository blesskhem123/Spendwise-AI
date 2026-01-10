# 🗄️ MongoDB Atlas Setup Guide

Complete step-by-step guide to set up MongoDB Atlas for SpendWise AI.

## 📋 Prerequisites

- A Google account (or email to sign up)
- 5-10 minutes

---

## 🚀 Step-by-Step Setup

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Click **"Try Free"** or **"Sign Up"**
3. Sign up with:
   - Google account (recommended), or
   - Email and password
4. Verify your email if required

---

### Step 2: Create a New Project

1. After logging in, you'll see the **"Create a Project"** screen
2. Enter project name: **"SpendWise AI"** (or any name you prefer)
3. Click **"Next"**
4. Click **"Create Project"**

---

### Step 3: Build a Database (Create Cluster)

1. You'll see **"Deploy a cloud database"** screen
2. Choose **"M0 FREE"** (Free tier - perfect for development)
3. Select a **Cloud Provider**:
   - **AWS** (recommended)
   - Google Cloud
   - Azure
4. Select a **Region**:
   - Choose the region closest to you (e.g., `us-east-1`, `eu-west-1`)
   - For India: `ap-south-1` (Mumbai)
5. Click **"Create"** (or "Create Cluster")
6. Wait 1-3 minutes for cluster to be created

---

### Step 4: Create Database User

1. You'll see a popup: **"Create Database User"**
2. Choose authentication method: **"Password"**
3. Enter:
   - **Username**: `spendwise-user` (or any username)
   - **Password**: Click **"Autogenerate Secure Password"** (or create your own)
   - ⚠️ **IMPORTANT**: **Copy the password** - you won't see it again!
4. Click **"Create Database User"**

**💡 Tip**: Save the username and password in a secure place (password manager).

---

### Step 5: Configure Network Access (IP Whitelist)

1. You'll see **"Add IP Address"** screen
2. For development/testing, click **"Add My Current IP Address"**
3. Click **"Add IP Address"**
4. For production, you can also add:
   - **"Allow Access from Anywhere"** (add `0.0.0.0/0`)
   - ⚠️ **Note**: Only use `0.0.0.0/0` for development. For production, whitelist specific IPs.

---

### Step 6: Get Connection String

1. Click **"Connect"** button (on your cluster card)
2. Choose **"Drivers"** (or "Connect your application")
3. Select:
   - **Driver**: Node.js
   - **Version**: 5.5 or later (or latest)
4. You'll see a connection string like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Copy the connection string**

---

### Step 7: Update Connection String with Your Credentials

1. Replace `<username>` with your database username (from Step 4)
2. Replace `<password>` with your database password (from Step 4)
3. Add database name at the end. Your final connection string should look like:

```
mongodb+srv://spendwise-user:YourPassword123@cluster0.xxxxx.mongodb.net/spendwise-ai?retryWrites=true&w=majority
```

**Format breakdown:**
- `spendwise-user` = your username
- `YourPassword123` = your password
- `cluster0.xxxxx.mongodb.net` = your cluster address
- `spendwise-ai` = database name (you can change this)
- `?retryWrites=true&w=majority` = connection options

---

### Step 8: Add to Backend Environment Variables

1. Open `backend/.env` file
2. Add or update `MONGODB_URI`:

```env
MONGODB_URI=mongodb+srv://spendwise-user:YourPassword123@cluster0.xxxxx.mongodb.net/spendwise-ai?retryWrites=true&w=majority
```

**⚠️ Important:**
- Replace `YourPassword123` with your actual password
- Replace `cluster0.xxxxx.mongodb.net` with your actual cluster address
- Make sure there are **no spaces** around the `=` sign
- If your password has special characters, you may need to URL-encode them:
  - `@` becomes `%40`
  - `#` becomes `%23`
  - `$` becomes `%24`
  - etc.

---

### Step 9: Test the Connection

1. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. You should see:
   ```
   ✅ MongoDB connected
   🚀 Backend server running on http://localhost:5000
   ```

3. If you see an error, check:
   - Connection string is correct
   - Username and password are correct
   - IP address is whitelisted
   - Internet connection is working

---

## 🐛 Troubleshooting

### Error: "Authentication failed"

**Solution:**
- Double-check username and password
- Make sure password doesn't have unencoded special characters
- Try regenerating the password in MongoDB Atlas

### Error: "IP not whitelisted"

**Solution:**
1. Go to MongoDB Atlas → **Network Access**
2. Click **"Add IP Address"**
3. Add your current IP or `0.0.0.0/0` for development
4. Wait 1-2 minutes for changes to take effect

### Error: "Connection timeout"

**Solution:**
- Check your internet connection
- Verify the connection string format
- Try using the connection string from "Connect" → "Drivers" again

### Password has special characters

**Solution:**
URL-encode special characters in your password:
- Go to [URL Encoder](https://www.urlencoder.org/)
- Paste your password
- Copy the encoded version
- Use it in the connection string

Or regenerate a password without special characters in MongoDB Atlas.

---

## 🔒 Security Best Practices

### For Development:
- ✅ Use M0 Free tier
- ✅ Whitelist your IP address
- ✅ Use autogenerated strong passwords
- ✅ Save credentials securely

### For Production:
- ✅ Use paid tier (M10+) for better performance
- ✅ Whitelist only your server IPs (not `0.0.0.0/0`)
- ✅ Use strong, unique passwords
- ✅ Enable MongoDB Atlas monitoring
- ✅ Set up database backups
- ✅ Use MongoDB Atlas encryption at rest

---

## 📝 Quick Reference

### Connection String Format:
```
mongodb+srv://<username>:<password>@<cluster-address>/<database-name>?retryWrites=true&w=majority
```

### Where to Find Things in MongoDB Atlas:

- **Clusters**: Left sidebar → "Database" → "Deployments"
- **Database Users**: Left sidebar → "Security" → "Database Access"
- **Network Access**: Left sidebar → "Security" → "Network Access"
- **Connection String**: Click "Connect" on your cluster → "Drivers"

---

## ✅ Checklist

- [ ] MongoDB Atlas account created
- [ ] Free cluster (M0) created
- [ ] Database user created (username + password saved)
- [ ] IP address whitelisted
- [ ] Connection string copied
- [ ] Connection string updated with credentials
- [ ] Database name added to connection string
- [ ] `MONGODB_URI` added to `backend/.env`
- [ ] Backend tested and connected successfully

---

## 🎉 You're Done!

Your MongoDB Atlas is now set up and ready to use! 

Your backend will automatically create the necessary collections (users, transactions, budgets, goals) when you start using the app.

---

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Connection String Guide](https://docs.mongodb.com/manual/reference/connection-string/)
- [MongoDB Atlas Free Tier Limits](https://www.mongodb.com/cloud/atlas/pricing)

---

**Need help?** Check the troubleshooting section or MongoDB Atlas support.


