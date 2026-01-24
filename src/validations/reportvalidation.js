const {Joi} = require('express-validation');

const getjsReport = {
  query: Joi.object({
    type: Joi.string().valid('pdf', 'xlsx', 'docx', 'html').required(),
    name: Joi.string().min(1).required(),
    dataSchemaId: Joi.number().integer().positive().required(),
  }).options({abortEarly: false}),
};

module.exports = {
  getjsReport,
};
