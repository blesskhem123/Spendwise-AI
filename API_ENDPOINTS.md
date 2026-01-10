# API Endpoints Documentation

This document outlines the API endpoints that the SpendWise AI frontend expects from the backend.

## Base URL
All endpoints are prefixed with `/api`

## Authentication

### POST /api/auth/signup
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### POST /api/auth/login
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### POST /api/auth/google
Authenticate user with Google OAuth token.

**Request Body:**
```json
{
  "token": "google-access-token-here"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Note:** The backend should:
1. Verify the Google access token
2. Get user info from Google (email, name, etc.)
3. Create or find user in database
4. Return JWT token and user object
```

### GET /api/auth/me
Get current user information (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### PUT /api/auth/profile
Update user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## Transactions

### GET /api/transactions
Get all transactions for the authenticated user.

**Query Parameters:**
- `limit` (optional): Limit number of results

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "transactions": [
    {
      "_id": "transaction_id",
      "type": "expense",
      "amount": 500,
      "description": "Grocery shopping",
      "category": "food",
      "date": "2024-01-15T00:00:00.000Z",
      "userId": "user_id"
    }
  ]
}
```

### POST /api/transactions
Create a new transaction.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "expense",
  "amount": 500,
  "description": "Grocery shopping",
  "category": "food",
  "date": "2024-01-15"
}
```

**Response:**
```json
{
  "transaction": {
    "_id": "transaction_id",
    "type": "expense",
    "amount": 500,
    "description": "Grocery shopping",
    "category": "food",
    "date": "2024-01-15T00:00:00.000Z",
    "userId": "user_id"
  }
}
```

### PUT /api/transactions/:id
Update a transaction.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "expense",
  "amount": 600,
  "description": "Grocery shopping",
  "category": "food",
  "date": "2024-01-15"
}
```

**Response:**
```json
{
  "transaction": {
    "_id": "transaction_id",
    "type": "expense",
    "amount": 600,
    "description": "Grocery shopping",
    "category": "food",
    "date": "2024-01-15T00:00:00.000Z"
  }
}
```

### DELETE /api/transactions/:id
Delete a transaction.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Transaction deleted successfully"
}
```

### GET /api/transactions/stats
Get transaction statistics.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "balance": 50000,
  "monthlyIncome": 50000,
  "monthlyExpense": 30000
}
```

## Budgets

### GET /api/budgets
Get all budgets for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "budgets": [
    {
      "_id": "budget_id",
      "category": "food",
      "limit": 5000,
      "spent": 3500,
      "month": 1,
      "year": 2024,
      "userId": "user_id"
    }
  ]
}
```

### POST /api/budgets
Create a new budget.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "category": "food",
  "limit": 5000,
  "month": 1,
  "year": 2024
}
```

**Response:**
```json
{
  "budget": {
    "_id": "budget_id",
    "category": "food",
    "limit": 5000,
    "spent": 0,
    "month": 1,
    "year": 2024
  }
}
```

### PUT /api/budgets/:id
Update a budget.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "category": "food",
  "limit": 6000,
  "month": 1,
  "year": 2024
}
```

**Response:**
```json
{
  "budget": {
    "_id": "budget_id",
    "category": "food",
    "limit": 6000,
    "spent": 3500,
    "month": 1,
    "year": 2024
  }
}
```

### DELETE /api/budgets/:id
Delete a budget.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Budget deleted successfully"
}
```

## Goals

### GET /api/goals
Get all savings goals for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "goals": [
    {
      "_id": "goal_id",
      "name": "Vacation Fund",
      "target": 50000,
      "saved": 25000,
      "targetDate": "2024-12-31T00:00:00.000Z",
      "userId": "user_id"
    }
  ]
}
```

### POST /api/goals
Create a new savings goal.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Vacation Fund",
  "target": 50000,
  "saved": 0,
  "targetDate": "2024-12-31"
}
```

**Response:**
```json
{
  "goal": {
    "_id": "goal_id",
    "name": "Vacation Fund",
    "target": 50000,
    "saved": 0,
    "targetDate": "2024-12-31T00:00:00.000Z"
  }
}
```

### PUT /api/goals/:id
Update a savings goal.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Vacation Fund",
  "target": 60000,
  "saved": 25000,
  "targetDate": "2024-12-31"
}
```

**Response:**
```json
{
  "goal": {
    "_id": "goal_id",
    "name": "Vacation Fund",
    "target": 60000,
    "saved": 25000,
    "targetDate": "2024-12-31T00:00:00.000Z"
  }
}
```

### DELETE /api/goals/:id
Delete a savings goal.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Goal deleted successfully"
}
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "message": "Error message here"
}
```

Common HTTP status codes:
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

## Transaction Types

- `income`: Money received
- `expense`: Money spent

## Categories

- `food`: Food & Dining
- `transport`: Transportation
- `shopping`: Shopping
- `entertainment`: Entertainment
- `bills`: Bills & Utilities
- `health`: Health & Fitness
- `education`: Education
- `other`: Other
