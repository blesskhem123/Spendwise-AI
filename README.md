# 💰 SpendWise AI

<div align="center">

**AI-powered personal finance and expense-tracking platform for students and young professionals**

[Features](#-features) • [Quick Start](#-quick-start) • [Setup](#-setup) • [Deployment](#-deployment)

</div>

---

## 📖 About

SpendWise AI is a modern, full-stack personal finance management application that helps you track expenses, manage budgets, set savings goals, and gain intelligent insights into your spending patterns. Built with React and Node.js, it offers a beautiful, responsive interface with dark mode support and secure authentication.

## ✨ Features

- **💸 Smart Expense Tracking** - Track daily income and expenses with detailed categorization
- **📈 Visual Analytics** - Beautiful charts and graphs to visualize your financial data
- **🎯 Budget Management** - Set monthly budgets by category and track spending against limits
- **🏆 Savings Goals** - Create and track multiple savings goals with progress indicators
- **🤖 AI-Powered Insights** - Get intelligent spending analysis and personalized recommendations
- **🔐 Google OAuth 2.0** - One-click sign-in with Google
- **🌓 Dark Mode** - Beautiful dark and light themes with smooth transitions
- **📱 Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Recharts, React Router v6, React Hot Toast  
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt.js  
**AI Categorization:** OpenAI API (primary) with a self-trained Naive Bayes fallback classifier (`natural` npm package)

## 🤖 AI-Powered Expense Categorization

`POST /api/categorize/suggest` predicts an expense category from its description as the user types:

1. **Primary path** - calls the OpenAI API (`gpt-4o-mini`) with the transaction description and the fixed category list, and parses the returned category.
2. **Fallback path** - if the OpenAI call fails or `OPENAI_API_KEY` isn't set (missing key, timeout, rate limit), it falls back to a Naive Bayes text classifier trained locally on a synthetic dataset of 752 labeled Indian transaction descriptions across the 8 expense categories.
3. The frontend pre-fills the category dropdown with the suggestion; the user can always override it manually.

The fallback classifier was trained with an 80/20 train/test split (601 train / 151 test) and scored **~95-98% accuracy** on the held-out test set across runs. The dataset generator and training script live in `/training`.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- MongoDB Atlas account (free) or local MongoDB
- Google Cloud Console account (optional, for Google OAuth)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/spendwise-ai.git
   cd spendwise-ai
   ```
   > Replace `yourusername` with the actual repository owner's username

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Set up environment variables**

   Create `.env` in root directory:
   ```env
   VITE_GOOGLE_CLIENT_ID=<your-google-client-id>
   VITE_API_URL=/api
   ```

   Create `backend/.env`:
   ```env
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<generate-strong-random-32-char-string>
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```
   
   > **Important:** Never commit `.env` files to version control. All values should be replaced with your actual credentials.

5. **Start backend server**
   ```bash
   cd backend
   npm run dev
   ```

6. **Start frontend server** (in a new terminal)
   ```bash
   npm run dev
   ```

7. **Open browser**
   Navigate to **http://localhost:3000**

## 📚 Setup Guides

### MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up
2. Create a new project
3. Build a database → Choose **M0 FREE** tier
4. Select **AWS** as cloud provider and choose region closest to you
5. Create database user:
   - Username: `spendwise-user` (or any name)
   - Password: Click "Autogenerate Secure Password" and **copy it**
6. Network Access → Add IP Address → Click "Add My Current IP Address"
7. Get connection string:
   - Click "Connect" on your cluster
   - Choose "Drivers" → Node.js
   - Copy the connection string
   - Replace `<username>` and `<password>` with your credentials
   - Add database name: `spendwise-ai`
8. Update `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-address>/spendwise-ai?retryWrites=true&w=majority
   ```
   > Replace `<username>`, `<password>`, and `<cluster-address>` with your actual MongoDB Atlas credentials

### Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **People API** or **Google+ API**
4. Configure OAuth consent screen:
   - Choose "External"
   - Fill in app name, support email
   - Add scopes: `email`, `profile`, `openid`
5. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000`
6. Copy the Client ID and add to root `.env`:
   ```env
   VITE_GOOGLE_CLIENT_ID=<your-client-id>.apps.googleusercontent.com
   ```
   > Replace `<your-client-id>` with the actual Client ID from Google Cloud Console

### Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as `JWT_SECRET` in `backend/.env`.

## 🏗️ Project Structure

```
spendwise-ai/
├── src/                    # Frontend source code
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page components
│   ├── context/            # React Context providers
│   ├── utils/              # Utility functions
│   └── styles/             # Global styles
├── backend/                # Backend source code
│   ├── server.js           # Express server
│   └── package.json
├── dist/                   # Production build output
└── package.json            # Frontend dependencies
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/stats` - Get statistics

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

## 🚀 Deployment

### Frontend

1. Build for production:
   ```bash
   npm run build
   ```

2. Deploy `dist/` folder to:
   - **Vercel**: Connect GitHub repo, build command: `npm run build`
   - **Netlify**: Connect GitHub repo, publish directory: `dist`
   - **AWS S3 + CloudFront**: Upload `dist/` folder

### Backend

1. Set production environment variables:
   ```env
   MONGODB_URI=<your-production-mongodb-connection-string>
   JWT_SECRET=<your-production-jwt-secret>
   FRONTEND_URL=https://<your-frontend-domain>.com
   NODE_ENV=production
   PORT=5000
   ```
   > Replace all `<placeholder>` values with your actual production credentials

2. Deploy to:
   - **Railway**: Connect GitHub, set root: `backend`
   - **Render**: Connect GitHub, set root: `backend`
   - **Heroku**: Use Heroku CLI or GitHub integration
   - **DigitalOcean/AWS**: Use PM2 process manager

### Production Checklist

- [ ] All environment variables set
- [ ] Strong JWT secret generated
- [ ] MongoDB Atlas configured
- [ ] Google OAuth production Client ID created
- [ ] `FRONTEND_URL` set to production domain
- [ ] `NODE_ENV=production` set
- [ ] CORS configured correctly
- [ ] HTTPS/SSL enabled

## 🛠️ Available Scripts

**Frontend:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

**Backend:**
```bash
cd backend
npm start       # Start production server
npm run dev      # Start development server with auto-reload
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS configuration
- Environment variable protection
- Input validation
- Secure API endpoints

## 🐛 Troubleshooting

**Backend connection errors:**
- Ensure MongoDB is running or MongoDB Atlas connection string is correct
- Check `MONGODB_URI` in `backend/.env`
- Verify IP is whitelisted in MongoDB Atlas

**Google OAuth not working:**
- Verify `VITE_GOOGLE_CLIENT_ID` is set in root `.env`
- Check Google Cloud Console has correct URLs configured
- Restart dev server after adding environment variables

**Port already in use:**
- Change `PORT` in `backend/.env` or use a different port
- Frontend will automatically use next available port

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">

**Made with ❤️ for better financial management**

⭐ Star this repo if you find it helpful!

</div>