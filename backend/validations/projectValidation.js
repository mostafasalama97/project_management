const Joi = require('joi');

const createProjectSchema = Joi.object({
  projectName: Joi.string().min(3).max(100).required(),
  description: Joi.string().allow('', null),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref('startDate')).required(),
  budget: Joi.number().positive().required(),
  status: Joi.string().valid('Not Started', 'In Progress', 'Completed').required()
});

const updateProjectSchema = Joi.object({
  projectName: Joi.string().min(3).max(100),
  description: Joi.string().allow('', null),
  startDate: Joi.date(),
  endDate: Joi.date().greater(Joi.ref('startDate')),
  budget: Joi.number().positive(),
  status: Joi.string().valid('Not Started', 'In Progress', 'Completed')
});

module.exports = {
  createProjectSchema,
  updateProjectSchema
};
