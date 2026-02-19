const { Joi } = require('express-validation');

const login = {
  body: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email format is invalid',
      'any.required': 'Email is required',
    }),

    password: Joi.string().required().messages({
      'any.required': 'Password is required',
    }),
  }),
};

module.exports = {
  login,
};
