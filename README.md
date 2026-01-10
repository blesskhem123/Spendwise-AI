# SpendWise AI 💰

AI-powered personal finance and expense-tracking platform for students and young professionals.

## Features

- 📊 **Smart Expense Tracking** - Track daily expenses with ease
- 🤖 **AI-Powered Insights** - Get intelligent spending analysis
- 💹 **Visual Analytics** - Beautiful charts and graphs
- 🎯 **Budget & Goals** - Set and track budgets and savings goals
- 🔐 **Google Authentication** - Sign in with Google (OAuth 2.0)
- 🌓 **Dark Mode** - Beautiful dark and light themes
- 📱 **Fully Responsive** - Works perfectly on all devices

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Charts**: Recharts
- **State Management**: Context API
- **Routing**: React Router v6
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## Quick Start

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open Browser
Navigate to: **http://localhost:3000**

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running on port 5000 (optional - frontend will work but API calls will fail without backend)

> 📖 **For detailed setup and usage instructions**, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

### Build for Production

```bash
npm run build
```

## API Configuration

The frontend expects the backend API to be running on `http://localhost:5000/api` in development. 

For production, set `VITE_API_URL` in your `.env` file if your backend is on a different domain. See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── context/       # Context providers (Auth, Theme)
├── utils/         # Utility functions and API client
├── hooks/         # Custom React hooks
└── styles/        # Global styles
```

## License

MIT
