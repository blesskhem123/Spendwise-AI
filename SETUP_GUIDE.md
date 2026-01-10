# SpendWise AI - Complete Setup & Usage Guide

This guide will walk you through setting up and using SpendWise AI from scratch.

## 🚀 Part 1: Initial Setup

### Step 1: Install Node.js
1. Download and install Node.js from [nodejs.org](https://nodejs.org/) (version 18 or higher)
2. Verify installation by opening terminal/command prompt and running:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Install Dependencies
1. Open terminal/command prompt
2. Navigate to the project folder:
   ```bash
   cd "C:\Users\bless\OneDrive\Desktop\Spendwise AI"
   ```
3. Install all required packages:
   ```bash
   npm install
   ```
   This will install React, Tailwind CSS, Recharts, and all other dependencies.

### Step 3: Start the Development Server
```bash
npm run dev
```

You should see output like:
```
  VITE v7.3.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

4. Open your browser and go to: **http://localhost:3000**

---

## 🎯 Part 2: Using the Website

### Getting Started (First Time)

#### 1. Create an Account
- You'll land on the **Landing Page**
- Click **"Get Started"** or **"Sign up for free"** button
- Fill in the form:
  - **Full Name**: Your name (e.g., "John Doe")
  - **Email**: Your email address
  - **Password**: At least 6 characters
  - **Confirm Password**: Same as password
- Click **"Create Account"**
- You'll be automatically logged in and redirected to the Dashboard

#### 2. Login (If you already have an account)
- Click **"Login"** on the landing page
- Enter your email and password
- Click **"Sign In"**

---

### 🏠 Dashboard Overview

Once logged in, you'll see the **Dashboard** with:

#### Top Section
- **Welcome message** with your name
- Current month display

#### Balance Cards (Top Row)
1. **Total Balance** (Blue card)
   - Shows your overall financial balance
   - Calculated from all transactions

2. **Monthly Income** (Green card)
   - Total income for the current month
   - Money you've received

3. **Monthly Expense** (Red card)
   - Total expenses for the current month
   - Money you've spent

#### Charts (Middle Section)
1. **Income vs Expense Chart** (Bar Chart)
   - Compares your income and expenses over the last 6 months
   - Green bars = Income
   - Red bars = Expenses

2. **Expense by Category** (Pie Chart)
   - Visual breakdown of spending by category
   - Each color represents a different category
   - Hover to see amounts

#### Recent Transactions (Bottom Section)
- List of your latest 10 transactions
- Shows description, category, date, and amount
- Green amounts = Income (+)
- Red amounts = Expenses (-)

#### Adding a Transaction from Dashboard
1. Click the **"+ Add Transaction"** button (top right of Recent Transactions)
2. Fill in the form:
   - **Type**: Choose Income or Expense
   - **Amount**: Enter the amount (₹)
   - **Description**: What is this for? (e.g., "Grocery shopping")
   - **Category**: Select a category (Food, Transport, Shopping, etc.)
   - **Date**: Select the date (defaults to today)
3. Click **"Add Transaction"**
4. The transaction appears immediately in your list!

**Mobile Users**: Tap the **floating blue "+" button** at bottom right

---

### 💰 Expenses Page

Navigate to **Expenses** from the sidebar menu.

#### Features Available:

**Summary Cards (Top)**
- Total number of transactions
- Total income this period
- Total expenses this period

**Filters & Search**
You can filter transactions in multiple ways:

1. **Search Bar**
   - Type to search by description
   - Example: Search "coffee" to find all coffee-related transactions

2. **Category Filter**
   - Select a category to see only transactions in that category
   - Options: Food, Transport, Shopping, Entertainment, Bills, Health, Education, Other

3. **Type Filter**
   - Filter by "All Types", "Income", or "Expense"

4. **Date Filter**
   - Select a specific date to see transactions on that day only

5. **Clear Filters**
   - Click "Clear all filters" to reset everything

**Transaction List**
Each transaction shows:
- Category icon and color
- Description
- Category name and date
- Amount (green for income, red for expense)

**Actions on Each Transaction:**
- **Edit** (pencil icon): Modify the transaction
  - Click the pencil icon
  - Change any field
  - Click "Update Transaction"
  
- **Delete** (trash icon): Remove the transaction
  - Click the trash icon
  - Confirm deletion
  - Transaction is permanently removed

**Adding Transactions:**
- Click **"+ Add Transaction"** button (top right)
- Same form as Dashboard
- Transaction is added to the list

---

### 🎯 Budget & Goals Page

Navigate to **Budget & Goals** from the sidebar.

#### Monthly Budgets Section

**Creating a Budget:**
1. Click **"+ Add Budget"** button
2. Fill in:
   - **Category**: Choose a spending category (e.g., Food)
   - **Budget Limit**: Maximum amount you want to spend (e.g., ₹5000)
   - **Month**: Select the month (e.g., January)
   - **Year**: Enter the year (e.g., 2024)
3. Click **"Create Budget"**

**Viewing Budgets:**
Each budget card shows:
- Category name
- Month and year
- Progress bar with percentage
- Amount spent vs. limit
- Color indicators:
  - 🟢 Green: Under budget (< 80%)
  - 🟡 Yellow: Approaching limit (80-100%)
  - 🔴 Red: Over budget (> 100%)
- Warning if over budget with excess amount

**Managing Budgets:**
- **Edit**: Click pencil icon to modify limit or month
- **Delete**: Click trash icon to remove budget

#### Savings Goals Section

**Creating a Goal:**
1. Click **"+ Add Goal"** button
2. Fill in:
   - **Goal Name**: e.g., "Vacation Fund", "Emergency Fund"
   - **Target Amount**: Total amount you want to save (e.g., ₹50,000)
   - **Currently Saved**: Amount already saved (e.g., ₹10,000)
   - **Target Date**: When you want to achieve this goal (optional)
3. Click **"Create Goal"**

**Viewing Goals:**
Each goal card shows:
- Goal name
- Target date (if set)
- Progress bar with percentage
- Amount saved vs. target
- Remaining amount needed
- Celebration message when goal is 100% achieved! 🎉

**Managing Goals:**
- **Edit**: Update the goal name, target, or saved amount
- **Delete**: Remove the goal

---

### 🤖 AI Insights Page

Navigate to **AI Insights** from the sidebar.

#### What You'll See:

**Intelligent Insights Cards:**
The AI analyzes your spending patterns and provides insights like:

1. **Spending Trends**
   - "You're spending X% more/less this month"
   - Compares current month to previous month
   - Shows the difference in amount

2. **Category Analysis**
   - Identifies your biggest expense category
   - Shows percentage of total spending
   - Example: "Food is your biggest expense (35% of total)"

3. **Savings Rate**
   - Analyzes your savings percentage
   - Warnings if spending more than earning
   - Encouragement if saving well

4. **Spending Patterns**
   - Shows if spending is concentrated in few categories
   - Provides suggestions for diversification

5. **Daily Averages**
   - Shows average daily spending
   - Helps you understand daily habits

6. **Savings Opportunities**
   - Suggests potential savings amounts
   - Based on spending comparisons

**Color-Coded Insights:**
- 🟢 **Green** (Success): Positive patterns
- 🟡 **Yellow** (Warning): Needs attention
- 🔴 **Red** (Danger): Critical issues
- 🔵 **Blue** (Info/Tips): General information or suggestions

**How It Works:**
- Insights update automatically as you add transactions
- Based on real transaction data
- No manual refresh needed
- More transactions = better insights

---

### ⚙️ Settings Page

Navigate to **Settings** from the sidebar.

#### Profile Information

**Update Your Profile:**
1. Edit your **Full Name**
2. Edit your **Email Address**
3. Click **"Save Changes"**
4. Changes are saved immediately

#### Appearance

**Theme Toggle:**
- Click the theme button to switch between:
  - **Light Mode**: Bright, clean interface
  - **Dark Mode**: Dark background, easier on the eyes
- Your preference is saved automatically
- Works across all pages

#### Account Actions

**Logout:**
- Click the **"Logout"** button
- You'll be signed out and redirected to login page
- All your data remains saved

---

## 🎨 UI Features & Tips

### Dark Mode
- Toggle available in:
  - Settings page
  - Sidebar (bottom section)
  - Landing page (top right)
- Automatically saves your preference
- Smooth transition between themes

### Responsive Design
- **Desktop**: Full sidebar navigation, large charts
- **Tablet**: Collapsible sidebar, optimized layout
- **Mobile**: Hamburger menu, floating action buttons, touch-optimized

### Navigation
- **Sidebar** (desktop): Always visible on the left
- **Mobile Menu**: Tap hamburger icon (☰) to open
- **Active Page**: Highlighted in blue/purple

### Notifications
- Success messages appear top-right (green)
- Error messages appear top-right (red)
- Auto-dismiss after 4 seconds
- Click to dismiss manually

### Loading States
- Skeleton loaders while data loads
- Smooth transitions
- No jarring jumps

---

## 🔧 Troubleshooting

### Issue: "npm install" fails
**Solution:**
- Make sure Node.js is installed (version 18+)
- Try: `npm cache clean --force`
- Then: `npm install` again

### Issue: Can't access localhost:3000
**Solution:**
- Make sure the dev server is running (`npm run dev`)
- Check if port 3000 is already in use
- Try: `npm run dev -- --port 3001` to use a different port

### Issue: Backend connection errors
**Solution:**
- Make sure your backend is running on port 5000
- Check `vite.config.js` proxy settings
- Update API base URL in `src/utils/api.js` if needed

### Issue: No data showing
**Solution:**
- Add some transactions first!
- Check browser console for errors (F12)
- Make sure you're logged in

### Issue: Charts not showing
**Solution:**
- Make sure you have transactions with expenses
- Charts need data to display
- Try adding a few transactions first

---

## 📱 Quick Start Checklist

- [ ] Install Node.js
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Create an account
- [ ] Add your first transaction
- [ ] Explore the Dashboard
- [ ] Try adding a budget
- [ ] Create a savings goal
- [ ] Check AI Insights
- [ ] Toggle dark mode
- [ ] Explore all pages

---

## 💡 Pro Tips

1. **Start Simple**: Add a few transactions first, then explore features
2. **Use Categories**: Properly categorize expenses for better insights
3. **Set Realistic Budgets**: Start with categories you spend most on
4. **Check Insights Regularly**: Review insights weekly for patterns
5. **Set Goals**: Having savings goals keeps you motivated
6. **Use Filters**: Filter transactions by category to analyze spending
7. **Mobile Friendly**: Use on your phone - works great on mobile!

---

## 🎉 You're All Set!

You now know how to use every feature of SpendWise AI. Start by adding a few transactions and explore the dashboard. The more you use it, the better insights you'll get!

Happy tracking! 💰📊










