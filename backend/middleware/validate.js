const logger = require('../utils/logger');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorDetails = error.details.map(detail => detail.message).join(', ');
      logger.warn(`Validation failed: ${errorDetails}`);
      return res.status(400).json({ error: 'Validation Error', message: errorDetails });
    }

    next();
  };
};

module.exports = validate;
