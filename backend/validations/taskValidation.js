const Joi = require('joi');

const createTaskSchema = Joi.object({
  taskName: Joi.string().min(3).max(100).required(),
  description: Joi.string().allow('', null),
  assignedTo: Joi.number().integer().positive().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref('startDate')).required(),
  priority: Joi.string().valid('Low', 'Medium', 'High').required(),
  status: Joi.string().valid('Not Started', 'In Progress', 'Completed').required(),
  projectId: Joi.number().integer().positive().required()
});

const updateTaskSchema = Joi.object({
  taskName: Joi.string().min(3).max(100),
  description: Joi.string().allow('', null),
  assignedTo: Joi.number().integer().positive(),
  startDate: Joi.date(),
  endDate: Joi.date().greater(Joi.ref('startDate')),
  priority: Joi.string().valid('Low', 'Medium', 'High'),
  status: Joi.string().valid('Not Started', 'In Progress', 'Completed'),
  projectId: Joi.number().integer().positive()
});

module.exports = {
  createTaskSchema,
  updateTaskSchema
};
