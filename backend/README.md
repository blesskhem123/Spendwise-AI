# SpendWise AI Backend

Node.js/Express backend API for SpendWise AI.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)

### 3. Start MongoDB
Make sure MongoDB is running locally or use MongoDB Atlas.

**Local MongoDB:**
- Install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service

**MongoDB Atlas (Cloud):**
- Create account at https://www.mongodb.com/cloud/atlas
- Get connection string
- Update `MONGODB_URI` in `.env`

### 4. Run the Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will start on `http://localhost:5000`

## API Endpoints

See `API_ENDPOINTS.md` in the root directory for full API documentation.

## Features

- ✅ User authentication (signup, login, Google OAuth)
- ✅ Transaction management (CRUD)
- ✅ Budget management
- ✅ Savings goals management
- ✅ JWT token authentication
- ✅ MongoDB database
- ✅ CORS enabled for frontend

## Troubleshooting

**MongoDB connection error:**
- Make sure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify MongoDB connection string format

**Port already in use:**
- Change `PORT` in `.env`
- Or stop the process using port 5000









