const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { createTaskSchema, updateTaskSchema } = require('../validations/taskValidation');

// Define /overdue before /:id to avoid route conflicts
router.get('/overdue', authenticate, taskController.getOverdueTasks); 

// Create Task (Managers only)
router.post('/', authenticate, authorizeRoles('Manager'), validate(createTaskSchema), taskController.createTask);

// Get All Tasks (Authenticated users)
router.get('/', authenticate, taskController.getAllTasks);

// Get Single Task
router.get('/:id', authenticate, taskController.getTaskById);

// Update Task (Managers or Assigned Employee)
router.put('/:id', authenticate, validate(updateTaskSchema), taskController.updateTask);

// Delete Task (Managers only)
router.delete('/:id', authenticate, authorizeRoles('Manager'), taskController.deleteTask);

module.exports = router;
