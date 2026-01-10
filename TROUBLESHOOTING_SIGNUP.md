# Troubleshooting: Signup Failed Error

## Why You're Seeing This Error

The "Signup failed" and "Something went wrong" errors appear because your **backend API server is not running** or not accessible.

The frontend is trying to connect to: `http://localhost:5000/api/auth/signup`

## Solutions

### Solution 1: Start Your Backend Server

1. **Check if you have a backend folder/project**
   - Do you have a separate backend project (Node.js/Express)?
   - If yes, navigate to that folder and start it

2. **Start the backend server** (typically):
   ```bash
   # Navigate to your backend folder
   cd ../your-backend-folder
   
   # Install dependencies (if not done)
   npm install
   
   # Start the server
   npm start
   # or
   node server.js
   # or
   npm run dev
   ```

3. **Verify it's running on port 5000**
   - Check your backend code for the port number
   - Should be running on `http://localhost:5000`
   - You should see a message like: "Server running on port 5000"

### Solution 2: Check Browser Console

1. Open your browser's Developer Tools:
   - Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
   - Go to the **Console** tab
   - Look for error messages (usually in red)

2. Common errors you might see:
   - `Network Error` or `ERR_CONNECTION_REFUSED` = Backend not running
   - `404 Not Found` = Backend running but endpoint doesn't exist
   - `500 Internal Server Error` = Backend error (check backend logs)

### Solution 3: Verify Backend Endpoint

Make sure your backend has the `/api/auth/signup` endpoint implemented:

```javascript
// Example Express.js endpoint
app.post('/api/auth/signup', async (req, res) => {
  // Your signup logic here
  // Should return: { token: "...", user: {...} }
});
```

### Solution 4: Test Backend Directly

1. Open a new terminal
2. Test if backend is accessible:
   ```bash
   curl http://localhost:5000/api/auth/signup
   # or use Postman/Insomnia
   ```

3. If you get `ECONNREFUSED`, the backend is not running

## Quick Checklist

- [ ] Backend server is running
- [ ] Backend is running on port 5000
- [ ] Backend has `/api/auth/signup` endpoint
- [ ] Backend endpoint returns `{ token, user }`
- [ ] No firewall blocking port 5000
- [ ] Check browser console for specific errors

## If You Don't Have a Backend Yet

You need to create a backend API. The frontend expects:

- **POST /api/auth/signup** - Create user account
- **POST /api/auth/login** - Login user
- **POST /api/auth/google** - Google OAuth login
- **GET /api/auth/me** - Get current user

See `API_ENDPOINTS.md` for the full API specification.

## Still Having Issues?

1. Check the browser console (F12) for detailed error messages
2. Check your backend server logs
3. Verify the backend is actually running: `http://localhost:5000`
4. Make sure no other application is using port 5000









