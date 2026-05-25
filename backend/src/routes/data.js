const express = require('express');
const axios = require('axios');
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const { TRANSACTION_STATUS } = require('../config/constants');

const router = express.Router();

router.get('/plans/:network', (req, res) => {
  const plans = {
    mtn: [
      { id: 1, name: '100MB', price: 100 },
      { id: 2, name: '500MB', price: 500 },
      { id: 3, name: '1GB', price: 1000 },
      { id: 4, name: '2GB', price: 2000 }
    ],
    airtel: [
      { id: 5, name: '500MB', price: 500 },
      { id: 6, name: '1GB', price: 1000 },
      { id: 7, name: '2GB', price: 2000 }
    ]
  };
  res.json({ plans: plans[req.params.network] || [] });
});

router.post('/buy', authMiddleware, async (req, res) => {
  try {
    const { network, mobile_number, amount } = req.body;
    if (!network || !mobile_number || !amount) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const connection = await pool.getConnection();
    const [users] = await connection.query('SELECT wallet_balance FROM users WHERE id = ?', [req.userId]);
    
    if (users[0].wallet_balance < amount) {
      connection.release();
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const reference = `DATA_${Date.now()}`;
    
    await connection.query(
      'UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?',
      [amount, req.userId]
    );

    await connection.query(
      'INSERT INTO transactions (user_id, service, amount, status, reference) VALUES (?, ?, ?, ?, ?)',
      [req.userId, 'data', amount, TRANSACTION_STATUS.SUCCESS, reference]
    );

    connection.release();
    res.json({ message: 'Data purchase successful', reference });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
