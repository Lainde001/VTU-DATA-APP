const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { generateToken } = require('../utils/jwt');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { fullname, email, phone, password } = req.body;
    
    if (!fullname || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const connection = await pool.getConnection();
    const [existing] = await connection.query(
      'SELECT id FROM users WHERE email = ? OR phone = ?',
      [email, phone]
    );

    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ message: 'Email or phone already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await connection.query(
      'INSERT INTO users (fullname, email, phone, password) VALUES (?, ?, ?, ?)',
      [fullname, email, phone, hashedPassword]
    );

    connection.release();

    const token = generateToken(result.insertId, email);
    res.status(201).json({ message: 'Registration successful', token, userId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const connection = await pool.getConnection();
    const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    connection.release();

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.email);
    res.json({ message: 'Login successful', token, user: { id: user.id, fullname: user.fullname, email: user.email, wallet_balance: user.wallet_balance } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
