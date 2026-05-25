const express = require('express');
const pool = require('../config/database');
const { adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [users] = await connection.query(
      'SELECT id, fullname, email, phone, wallet_balance, created_at FROM users'
    );
    connection.release();

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/stats', adminMiddleware, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [stats] = await connection.query(
      'SELECT COUNT(*) as totalUsers, SUM(wallet_balance) as totalBalance FROM users'
    );
    connection.release();

    res.json(stats[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
