const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const logger = require('../utils/logger');

dotenv.config();

exports.authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    logger.warn('Access denied. No token provided.');
    return res.status(401).json({ error: 'Unauthorized', message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    logger.warn('Invalid token:', error);
    res.status(403).json({ error: 'Forbidden', message: 'Invalid token.' });
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      logger.warn(`Access denied. User role ${req.user.role} insufficient.`);
      return res.status(403).json({ error: 'Forbidden', message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};
