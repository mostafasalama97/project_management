const db = require('../models');
const Task = db.Task;
const User = db.User;
const Project = db.Project;
const { Op } = require('sequelize');
const logger = require('../utils/logger');

exports.createTask = async (req, res) => {
  try {
    const { taskName, description, assignedTo, startDate, endDate, priority, status, projectId } = req.body;
    
    // Check if project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      logger.warn(`Project not found with ID: ${projectId}`);
      return res.status(404).json({ error: 'Not Found', message: 'Project not found' });
    }

    // Check if assigned user exists
    const user = await User.findByPk(assignedTo);
    if (!user) {
      logger.warn(`Assigned user not found with ID: ${assignedTo}`);
      return res.status(404).json({ error: 'Not Found', message: 'Assigned user not found' });
    }

    const task = await Task.create({
      taskName,
      description,
      assignedTo,
      startDate,
      endDate,
      priority,
      status,
      projectId,
    });
    res.status(201).json(task);
  } catch (error) {
    logger.error('Task creation failed:', error);
    res.status(500).json({ error: 'Task creation failed', message: error.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: [
        { model: User, attributes: ['userId', 'username'] },
        { model: Project, attributes: ['projectId', 'projectName'] },
      ],
    });
    res.json(tasks);
  } catch (error) {
    logger.error('Fetching all tasks failed:', error);
    res.status(500).json({ error: 'Fetching tasks failed', message: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id, 10);

    if (isNaN(taskId)) {
      logger.warn(`Invalid taskId: ${req.params.id}`);
      return res.status(400).json({ error: 'Invalid task ID', message: 'Task ID must be an integer' });
    }

    const task = await Task.findByPk(taskId, {
      include: [
        { model: db.User, attributes: ['userId', 'username'] },
        { model: db.Project, attributes: ['projectId', 'projectName'] },
      ],
    });

    if (!task) {
      logger.warn(`Task not found with ID: ${taskId}`);
      return res.status(404).json({ error: 'Not Found', message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    logger.error('Fetching task by ID failed:', error);
    res.status(500).json({ error: 'Fetching task failed', message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { taskName, description, assignedTo, startDate, endDate, priority, status, projectId } = req.body;
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      logger.warn(`Task not found for update with ID: ${req.params.id}`);
      return res.status(404).json({ error: 'Not Found', message: 'Task not found' });
    }

    // Authorization: Managers can update any task; Employees can update only their tasks
    if (req.user.role !== 'Manager' && task.assignedTo !== req.user.userId) {
      logger.warn(`Access denied for user ID: ${req.user.userId} to update task ID: ${req.params.id}`);
      return res.status(403).json({ error: 'Forbidden', message: 'Access denied. Cannot update this task.' });
    }

    // If reassigning, check if the new user exists
    if (assignedTo) {
      const user = await User.findByPk(assignedTo);
      if (!user) {
        logger.warn(`Assigned user not found with ID: ${assignedTo}`);
        return res.status(404).json({ error: 'Not Found', message: 'Assigned user not found' });
      }
    }

    // If changing project, check if the project exists
    if (projectId) {
      const project = await Project.findByPk(projectId);
      if (!project) {
        logger.warn(`Project not found with ID: ${projectId}`);
        return res.status(404).json({ error: 'Not Found', message: 'Project not found' });
      }
    }

    await task.update({ taskName, description, assignedTo, startDate, endDate, priority, status, projectId });
    res.json(task);
  } catch (error) {
    logger.error('Updating task failed:', error);
    res.status(500).json({ error: 'Task update failed', message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      logger.warn(`Task not found for deletion with ID: ${req.params.id}`);
      return res.status(404).json({ error: 'Not Found', message: 'Task not found' });
    }

    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    logger.error('Deleting task failed:', error);
    res.status(500).json({ error: 'Task deletion failed', message: error.message });
  }
};

exports.getOverdueTasks = async (req, res) => {
  try {
    const today = new Date();
    const overdueTasks = await Task.findAll({
      where: {
        endDate: { [Op.lt]: today },
        status: { [Op.ne]: 'Completed' },
      },
      include: [
        { model: User, attributes: ['userId', 'username'] },
        { model: Project, attributes: ['projectId', 'projectName'] },
      ],
    });
    res.json(overdueTasks);
  } catch (error) {
    logger.error('Fetching overdue tasks failed:', error);
    res.status(500).json({ error: 'Fetching overdue tasks failed', message: error.message });
  }
};
