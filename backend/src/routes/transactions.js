const express = require('express');
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [transactions] = await connection.query(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC',
      [req.userId]
    );
    connection.release();

    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
