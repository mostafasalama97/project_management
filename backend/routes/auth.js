const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validations/authValidation');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware'); 

// Register Route (optional, can be omitted if only managers can create users)
router.post('/register', validate(registerSchema), authController.register);

// Login Route
router.post('/login', validate(loginSchema), authController.login);

// Get All Users (Managers only)
router.get('/users', authenticate, authorizeRoles('Manager'), authController.getAllUsers);

module.exports = router;
