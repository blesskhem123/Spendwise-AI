# 🚀 Quick Start - 5 Minutes to Running SpendWise AI

## Step-by-Step Instructions

### 1️⃣ Install Node.js (if you haven't already)
- Download from: https://nodejs.org/
- Install the LTS version
- Verify: Open terminal and type `node --version` (should show v18 or higher)

### 2️⃣ Open Terminal/Command Prompt
- **Windows**: Press `Win + R`, type `cmd`, press Enter
- **Mac**: Press `Cmd + Space`, type `Terminal`, press Enter
- **Linux**: Press `Ctrl + Alt + T`

### 3️⃣ Navigate to Project Folder
```bash
cd "C:\Users\bless\OneDrive\Desktop\Spendwise AI"
```

### 4️⃣ Install Dependencies (First Time Only)
```bash
npm install
```
⏱️ This takes 1-2 minutes. Wait for it to complete.

### 5️⃣ Start the Server
```bash
npm run dev
```

You should see:
```
  VITE v7.3.0  ready in 500 ms
  ➜  Local:   http://localhost:3000/
```

### 6️⃣ Open Your Browser
- Open Chrome, Firefox, or Edge
- Go to: **http://localhost:3000**
- You should see the SpendWise AI landing page! 🎉

---

## ✅ First Time Using the App

### Create Your Account:
1. Click **"Get Started"** button
2. Fill in:
   - Your name
   - Email address
   - Password (at least 6 characters)
   - Confirm password
3. Click **"Create Account"**
4. You're in! Welcome to your Dashboard

### Add Your First Transaction:
1. Click **"+ Add Transaction"** button (top right of Recent Transactions)
2. Fill in:
   - Type: Choose "Expense" or "Income"
   - Amount: e.g., "500"
   - Description: e.g., "Lunch at restaurant"
   - Category: Choose a category (e.g., "Food & Dining")
   - Date: Today's date (already selected)
3. Click **"Add Transaction"**
4. See it appear in your Recent Transactions! ✨

---

## 🎯 Next Steps

- **Explore Dashboard**: See your balance cards and charts
- **Go to Expenses Page**: Click "Expenses" in sidebar to see all transactions
- **Set a Budget**: Go to "Budget & Goals" and create a monthly budget
- **Check Insights**: Visit "AI Insights" to see spending analysis
- **Try Dark Mode**: Toggle theme in Settings or sidebar

---

## 🆘 Troubleshooting

**Problem**: `npm install` gives errors
- **Solution**: Make sure Node.js is installed. Run `node --version` to check

**Problem**: Port 3000 already in use
- **Solution**: The terminal will suggest another port (like 3001). Use that URL instead

**Problem**: Page shows errors/blank
- **Solution**: 
  1. Check terminal for error messages
  2. Make sure you ran `npm install` first
  3. Try refreshing the browser (Ctrl+R or Cmd+R)

**Problem**: Backend connection errors
- **Solution**: This is normal if you don't have a backend running yet. The frontend will still work, but API calls will fail. For full functionality, you'll need the backend API running.

---

## 📚 Need More Help?

- Full detailed guide: See [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- API documentation: See [API_ENDPOINTS.md](./API_ENDPOINTS.md)

---

**That's it! You're ready to start tracking your finances! 💰**










