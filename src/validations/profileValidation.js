const { Joi } = require('express-validation');

const profileConfig = require('../config/profile');

const { minLength, maxLength } = profileConfig.password;

const update = {
  body: Joi.object({
    name: Joi.string().trim().max(255).required().messages({
      'any.required': 'Name is required',
      'string.empty': 'Name cannot be empty',
      'string.max': 'Name cannot be longer than 255 characters',
    }),
    // Same rule as the login form, so the saved address can always be used to log in.
    email: Joi.string().trim().max(255).email().required().messages({
      'any.required': 'Email is required',
      'string.empty': 'Email cannot be empty',
      'string.email': 'Email format is invalid',
      'string.max': 'Email cannot be longer than 255 characters',
    }),
    removePicture: Joi.boolean().default(false),
  }),
};

const changePassword = {
  body: Joi.object({
    currentPassword: Joi.string().required().messages({
      'any.required': 'Current password is required',
      'string.empty': 'Current password is required',
    }),
    newPassword: Joi.string()
      .min(minLength)
      .max(maxLength)
      .invalid(Joi.ref('currentPassword'))
      .required()
      .messages({
        'any.required': 'New password is required',
        'string.empty': 'New password is required',
        'string.min': `New password must be at least ${minLength} characters`,
        'string.max': `New password cannot be longer than ${maxLength} characters`,
        'any.invalid': 'New password must be different from the current password',
      }),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
      'any.required': 'Password confirmation is required',
      'any.only': 'Password confirmation does not match the new password',
    }),
  }),
};

module.exports = {
  changePassword,
  update,
};
