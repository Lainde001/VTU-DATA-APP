const express = require('express');
const axios = require('axios');
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/initialize', authMiddleware, async (req, res) => {
  try {
    const { amount, email } = req.body;
    if (!amount || !email) {
      return res.status(400).json({ message: 'Amount and email required' });
    }

    const reference = `PAY_${Date.now()}`;

    try {
      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        { email, amount: amount * 100, reference },
        { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
      );

      res.json({
        status: 'success',
        authorization_url: response.data.data.authorization_url,
        reference
      });
    } catch (error) {
      res.status(500).json({ message: 'Payment initialization failed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
