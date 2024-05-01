const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const authenticate = require('../middleware/authenticate');

// Get all users
router.get('/', authenticate, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;