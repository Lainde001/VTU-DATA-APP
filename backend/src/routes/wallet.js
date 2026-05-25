const express = require('express');
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const { TRANSACTION_TYPES, TRANSACTION_STATUS } = require('../config/constants');

const router = express.Router();

router.get('/balance', authMiddleware, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [users] = await connection.query('SELECT wallet_balance FROM users WHERE id = ?', [req.userId]);
    connection.release();

    res.json({ wallet_balance: users[0]?.wallet_balance || 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/fund', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const reference = `TXN_${Date.now()}_${req.userId}`;
    const connection = await pool.getConnection();

    await connection.query(
      'INSERT INTO wallet_transactions (user_id, amount, type, reference, status) VALUES (?, ?, ?, ?, ?)',
      [req.userId, amount, TRANSACTION_TYPES.CREDIT, reference, TRANSACTION_STATUS.PENDING]
    );

    connection.release();
    res.json({ message: 'Funding initiated', reference });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/confirm-fund', authMiddleware, async (req, res) => {
  try {
    const { reference, amount } = req.body;
    const connection = await pool.getConnection();

    await connection.query(
      'UPDATE wallet_transactions SET status = ? WHERE reference = ?',
      [TRANSACTION_STATUS.SUCCESS, reference]
    );

    await connection.query(
      'UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?',
      [amount, req.userId]
    );

    connection.release();
    res.json({ message: 'Wallet funded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
