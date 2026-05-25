# VTU DATA APP - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

### Register
```
POST /auth/register
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "phone": "08012345678",
  "password": "password123"
}
```

### Login
```
POST /auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

## Wallet

### Get Balance
```
GET /wallet/balance
Headers: Authorization: Bearer <token>
```

### Fund Wallet
```
POST /wallet/fund
{
  "amount": 5000
}
```

### Confirm Funding
```
POST /wallet/confirm-fund
{
  "reference": "TXN_...",
  "amount": 5000
}
```

## Data & Airtime

### Get Plans
```
GET /data/plans/:network
(network: mtn, airtel, etc.)
```

### Buy Data
```
POST /data/buy
{
  "network": "mtn",
  "mobile_number": "08012345678",
  "amount": 1000
}
```

## Transactions

### Get Transactions
```
GET /transactions
Headers: Authorization: Bearer <token>
```

## Admin

### Get Users
```
GET /admin/users
Headers: Authorization: Bearer <admin_token>
```

### Get Stats
```
GET /admin/stats
Headers: Authorization: Bearer <admin_token>
```
