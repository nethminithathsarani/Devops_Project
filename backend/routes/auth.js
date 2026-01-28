const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const requireAuth = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD_HASH = (process.env.ADMIN_PASSWORD_HASH || '').replace(/\$\$/g, '$');

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable must be set');
}

if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH) {
  throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD_HASH environment variables must be set');
}

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return false;
  }
  return true;
};

router.post(
  '/login',
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    if (!handleValidation(req, res)) return;
    const { username, password } = req.body;
    if (username !== ADMIN_USERNAME) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    try {
      const valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
      if (!valid) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ role: 'admin', username: ADMIN_USERNAME }, JWT_SECRET, { expiresIn: '2h' });
      res.json({ token, username: ADMIN_USERNAME });
    } catch (err) {
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

router.get('/me', requireAuth, (req, res) => {
  res.json({ username: ADMIN_USERNAME });
});

module.exports = router;
