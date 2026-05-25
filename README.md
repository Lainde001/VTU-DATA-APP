# VTU DATA APP 🚀

Data/Recharge VTU application with user login, wallet, API integration & admin dashboard.

## Features

✅ User Registration & Login  
✅ Wallet System  
✅ Buy Data & Airtime  
✅ Payment Gateway (Paystack)  
✅ Transaction History  
✅ Admin Dashboard  
✅ API Integration (VTU)  

## Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: MySQL
- **Authentication**: JWT
- **Payment**: Paystack

## Quick Start

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### Database Setup

```bash
mysql -u root -p < database/schema.sql
```

## API Documentation

See `docs/API.md` for complete API documentation.

## File Structure

```
VTU-DATA-APP/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── config/
│   │   └── index.js
│   ├── package.json
│   └── .env.example
├── database/
│   └── schema.sql
├── docs/
│   └── API.md
└── README.md
```

## License

MIT
