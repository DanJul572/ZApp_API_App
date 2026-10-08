const { Joi } = require('express-validation');

const enums = require('../enums');

const id = Joi.number().integer().positive().required().messages({
  'any.required': 'Email id is required',
  'number.base': 'Email id must be a number',
});

const emailAddress = Joi.string().trim().email({ tlds: false });

const dataSource = Joi.object({
  id: Joi.any(),
  name: Joi.string().trim().required().messages({
    'any.required': 'Data source name is required',
    'string.empty': 'Data source name cannot be empty',
  }),
  sql: Joi.string().trim().required().messages({
    'any.required': 'Data source SQL query is required',
    'string.empty': 'Data source SQL query cannot be empty',
  }),
});

const emailBody = {
  name: Joi.string().trim().max(255).required().messages({
    'any.required': 'Email name is required',
    'string.empty': 'Email name cannot be empty',
    'string.max': 'Email name cannot be longer than 255 characters',
  }),
  description: Joi.string().allow('', null),
  to: Joi.string().allow('', null),
  subject: Joi.string().max(255).allow('', null).messages({
    'string.max': 'Email subject cannot be longer than 255 characters',
  }),
  body: Joi.string().allow('', null),
  design: Joi.object().unknown(true).allow(null),

  cc: Joi.array().items(emailAddress).unique().default([]),
  bcc: Joi.array().items(emailAddress).unique().default([]),

  primarySource: Joi.object({
    name: Joi.string()
      .allow('')
      .when('sql', {
        is: Joi.string().trim().min(1),
        then: Joi.string().trim().required().messages({
          'string.empty': 'Primary source name is required when it has a SQL query',
        }),
      }),
    sql: Joi.string().allow(''),
  }).allow(null),
  optionalSources: Joi.array().items(dataSource).default([]),

  mergeTags: Joi.array()
    .items(
      Joi.object({
        id: Joi.any(),
        tag: Joi.string().trim().required().messages({
          'string.empty': 'Merge tag name cannot be empty',
        }),
        column: Joi.string().trim().required().messages({
          'string.empty': 'Merge tag column cannot be empty',
        }),
        defaultValue: Joi.string().allow('', null),
      }),
    )
    .unique('tag')
    .default([])
    .messages({ 'array.unique': 'Merge tag names must be unique' }),

  useScheduler: Joi.boolean().default(false),
  scheduler: Joi.when('useScheduler', {
    is: true,
    then: Joi.object({
      type: Joi.string()
        .valid(...Object.keys(enums.emailSchedulerType))
        .required(),
      startTime: Joi.date().required().messages({
        'any.required': 'Scheduler start time is required',
        'date.base': 'Scheduler start time is required',
      }),
      endTime: Joi.date().min(Joi.ref('startTime')).required().messages({
        'any.required': 'Scheduler end time is required',
        'date.base': 'Scheduler end time is required',
        'date.min': 'Scheduler end time must be after the start time',
      }),
    }).required(),
    otherwise: Joi.any(),
  }),

  settings: Joi.object({
    priority: Joi.string()
      .valid(...Object.keys(enums.emailPriorityLevel))
      .default('normal'),
    openTracking: Joi.boolean().default(false),
    clickTracking: Joi.boolean().default(false),
    unsubscribeLink: Joi.boolean().default(false),
  }).default({}),
};

const getRows = {
  query: Joi.object({
    page: Joi.number().integer().min(1),
    search: Joi.string().allow(''),
  }).options({ abortEarly: false }),
};

const getDetail = {
  query: Joi.object({ id }).options({ abortEarly: false }),
};

const getAttachment = {
  query: Joi.object({ id }).options({ abortEarly: false }),
};

const create = {
  body: Joi.object(emailBody).options({ abortEarly: false }),
};

const update = {
  body: Joi.object({
    ...emailBody,
    id,
    keepAttachmentIds: Joi.array().items(Joi.number().integer().positive()).default([]),
  }).options({ abortEarly: false }),
};

const destroy = {
  body: Joi.object({ id }).options({ abortEarly: false }),
};

module.exports = {
  create,
  destroy,
  getAttachment,
  getDetail,
  getRows,
  update,
};
