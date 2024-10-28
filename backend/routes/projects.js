const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { createProjectSchema, updateProjectSchema } = require('../validations/projectValidation');

// Create Project (Managers only)
router.post('/', authenticate, authorizeRoles('Manager'), validate(createProjectSchema), projectController.createProject);

// Get All Projects (Authenticated users)
router.get('/', authenticate, projectController.getAllProjects);

// Get Single Project
router.get('/:id', authenticate, projectController.getProjectById);

// Update Project (Managers only)
router.put('/:id', authenticate, authorizeRoles('Manager'), validate(updateProjectSchema), projectController.updateProject);

// Delete Project (Managers only)
router.delete('/:id', authenticate, authorizeRoles('Manager'), projectController.deleteProject);

module.exports = router;
