const db = require('../models');
const Project = db.Project;
const User = db.User;
const logger = require('../utils/logger');

exports.createProject = async (req, res) => {
  try {
    const { projectName, description, startDate, endDate, budget, status } = req.body;
    const project = await Project.create({
      projectName,
      description,
      startDate,
      endDate,
      budget,
      status,
      ownerId: req.user.userId,
    });
    res.status(201).json(project);
  } catch (error) {
    logger.error('Project creation failed:', error);
    res.status(500).json({ error: 'Project creation failed', message: error.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [{ model: User, attributes: ['userId', 'username', 'role'] }],
    });
    res.json(projects);
  } catch (error) {
    logger.error('Fetching all projects failed:', error);
    res.status(500).json({ error: 'Fetching projects failed', message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['userId', 'username', 'role'] },
        {
          model: db.Task,
          include: [{ model: User, attributes: ['userId', 'username'] }],
        }
      ],
    });
    if (!project) {
      logger.warn(`Project not found with ID: ${req.params.id}`);
      return res.status(404).json({ error: 'Not Found', message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    logger.error('Fetching project by ID failed:', error);
    res.status(500).json({ error: 'Fetching project failed', message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { projectName, description, startDate, endDate, budget, status } = req.body;
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      logger.warn(`Project not found for update with ID: ${req.params.id}`);
      return res.status(404).json({ error: 'Not Found', message: 'Project not found' });
    }

    await project.update({ projectName, description, startDate, endDate, budget, status });
    res.json(project);
  } catch (error) {
    logger.error('Updating project failed:', error);
    res.status(500).json({ error: 'Project update failed', message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      logger.warn(`Project not found for deletion with ID: ${req.params.id}`);
      return res.status(404).json({ error: 'Not Found', message: 'Project not found' });
    }

    await project.destroy();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    logger.error('Deleting project failed:', error);
    res.status(500).json({ error: 'Project deletion failed', message: error.message });
  }
};
