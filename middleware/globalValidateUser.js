const Joi = require("joi");

const validateUser = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({ "string.empty": "Name is required" }),
    email: Joi.string().email().required().messages({ "string.email": "Invalid email format" }),
    password: Joi.string().min(6).required(),
    age: Joi.number().min(0).max(120),
    role: Joi.string().valid("user", "admin"),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = validateUser;
