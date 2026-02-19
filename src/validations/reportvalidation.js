const { Joi } = require('express-validation');

const getjsReport = {
  query: Joi.object({
    type: Joi.string().valid('pdf', 'xlsx', 'docx', 'html').required().messages({
      'any.required': 'Report type is required',
      'any.only': 'Report type must be one of pdf, xlsx, docx, or html',
    }),

    name: Joi.string().min(1).required().messages({
      'any.required': 'Report name is required',
      'string.empty': 'Report name cannot be empty',
      'string.min': 'Report name cannot be empty',
    }),

    dataSchemaId: Joi.number().integer().positive().required().messages({
      'any.required': 'Data schema id is required',
      'number.base': 'Data schema id must be a number',
      'number.integer': 'Data schema id must be an integer',
      'number.positive': 'Data schema id must be a positive number',
    }),
  }).options({ abortEarly: false }),
};

const getPreviewDataSchema = {
  query: Joi.object({
    dataSchemaId: Joi.number().integer().positive().required().messages({
      'any.required': 'Data schema id is required',
      'number.base': 'Data schema id must be a number',
      'number.integer': 'Data schema id must be an integer',
      'number.positive': 'Data schema id must be a positive number',
    }),
  }).options({ abortEarly: false }),
};

module.exports = {
  getjsReport,
  getPreviewDataSchema,
};
