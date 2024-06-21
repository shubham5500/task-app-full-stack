const Joi = require("joi");

const validateTask = (task) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().allow(null, ''),
    status: Joi.string().valid("pending", "completed", "in_progess").required(),
    priority: Joi.string().valid("low", "medium", "high").required(),
    assignedTo: Joi.number(),
    position: Joi.number(),
    listId: Joi.required(),
    fileUrl: Joi.string(),
  });

  return schema.validate(task);
};

const validateTaskFile = (obj) => {
  const schema = Joi.object({
    fileUrl: Joi.string().required(),
    uploadedBy: Joi.number().required(),
  });

  return schema.validate(obj);
};

module.exports = {
  validateTask,
  validateTaskFile,
};
