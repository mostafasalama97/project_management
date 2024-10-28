const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;
const dotenv = require('dotenv');
const logger = require('../utils/logger');

dotenv.config();

exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = await User.create({ username, password, role });
    
    // Generate token for the newly registered user
    const payload = { userId: user.userId, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    logger.error('Registration failed:', error);
    res.status(500).json({ error: 'Registration failed', message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user || !(await user.validPassword(password))) {
      logger.warn(`Invalid login attempt for username: ${username}`);
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials' });
    }
    const payload = { userId: user.userId, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    logger.error('Login failed:', error);
    res.status(500).json({ error: 'Login failed', message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['userId', 'username', 'role'],
    });
    res.json(users);
  } catch (error) {
    logger.error('Fetching users failed:', error);
    res.status(500).json({ error: 'Failed to fetch users', message: error.message });
  }
};
