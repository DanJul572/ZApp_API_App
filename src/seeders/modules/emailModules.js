const enums = require('../../enums');

// Definitions of the email tables as modules. Their ids are not fixed in enums.moduleId, because
// ids after the core modules may already be used by modules made with the module builder; the
// seeder looks each module up by name instead. Sequence follows the position in the list.

function field(name, label, inputType, dataType, options = {}) {
  return {
    name,
    label,
    inputType,
    dataType,
    tableRef: null,
    tableRefKey: null,
    tableRefName: null,
    tableRefAlias: null,
    tableRefFilter: null,
    regex: null,
    multiSelect: false,
    identity: false,
    notNull: false,
    unique: false,
    ...options,
  };
}

const id = () =>
  field('id', 'ID', enums.inputType.number, enums.dataType.integer, {
    identity: true,
    notNull: true,
    unique: true,
  });

const shortText = (name, label, options) =>
  field(name, label, enums.inputType.shortText, enums.dataType.varchar, options);

const longText = (name, label, options) =>
  field(name, label, enums.inputType.longText, enums.dataType.text, options);

const number = (name, label, options) =>
  field(name, label, enums.inputType.number, enums.dataType.integer, options);

const toggle = (name, label, options) =>
  field(name, label, enums.inputType.toggle, enums.dataType.boolean, options);

const datetime = (name, label, options) =>
  field(name, label, enums.inputType.datetime, enums.dataType.datetime, options);

const json = (name, label, options) =>
  field(name, label, enums.inputType.code, enums.dataType.json, options);

const reference = (name, label, tableRef, tableRefName, options) =>
  field(name, label, enums.inputType.dropdown, enums.dataType.tableReference, {
    tableRef,
    tableRefKey: 'id',
    tableRefName,
    ...options,
  });

const emailReference = options => reference('emailId', 'Email', 'emails', 'name', options);

const lookup = (name, label) => ({
  name,
  label,
  fields: [id(), shortText('label', 'Label', { notNull: true })],
});

module.exports = [
  {
    name: 'emails',
    label: 'Email',
    fields: [
      id(),
      shortText('name', 'Name', { notNull: true }),
      longText('description', 'Description'),
      longText('to', 'To'),
      shortText('subject', 'Subject'),
      field('body', 'Body', enums.inputType.richText, enums.dataType.text),
      json('design', 'Design'),
      toggle('useScheduler', 'Use Scheduler', { notNull: true }),
    ],
  },
  {
    name: 'emailCC',
    label: 'Email CC',
    fields: [
      id(),
      shortText('label', 'Address', { notNull: true }),
      emailReference({ notNull: true }),
    ],
  },
  {
    name: 'emailBCC',
    label: 'Email BCC',
    fields: [
      id(),
      shortText('label', 'Address', { notNull: true }),
      emailReference({ notNull: true }),
    ],
  },
  {
    name: 'emailTags',
    label: 'Email Tags',
    fields: [
      id(),
      shortText('label', 'Label', { notNull: true }),
      shortText('value', 'Value', { notNull: true }),
      shortText('defaultValue', 'Default Value'),
      emailReference({ notNull: true }),
    ],
  },
  {
    name: 'emailAttachments',
    label: 'Email Attachments',
    fields: [
      id(),
      shortText('fileName', 'File Name', { notNull: true }),
      shortText('mimeType', 'MIME Type', { notNull: true }),
      number('fileSize', 'File Size', { notNull: true }),
      field('fileBuffer', 'File', enums.inputType.file, enums.dataType.byte, { notNull: true }),
      emailReference({ notNull: true }),
    ],
  },
  lookup('emailPriorityLevels', 'Email Priority Levels'),
  {
    name: 'emailSettings',
    label: 'Email Settings',
    fields: [
      id(),
      toggle('openTracking', 'Open Tracking'),
      toggle('clickTracking', 'Click Tracking'),
      toggle('unsubscribeLink', 'Unsubscribe Link'),
      emailReference({ notNull: true, unique: true }),
      reference('emailPriorityLevelId', 'Priority Level', 'emailPriorityLevels', 'label', {
        notNull: true,
      }),
    ],
  },
  lookup('emailSchedulerTypes', 'Email Scheduler Types'),
  {
    name: 'emailSchedulers',
    label: 'Email Schedulers',
    fields: [
      id(),
      datetime('startTime', 'Start Time', { notNull: true }),
      datetime('endTime', 'End Time', { notNull: true }),
      datetime('nextRunAt', 'Next Run At'),
      emailReference({ notNull: true, unique: true }),
      reference('emailSchedulerTypeId', 'Scheduler Type', 'emailSchedulerTypes', 'label', {
        notNull: true,
      }),
    ],
  },
  lookup('emailDataSourceTypes', 'Email Data Source Types'),
  {
    name: 'emailDataSources',
    label: 'Email Data Sources',
    fields: [
      id(),
      shortText('name', 'Name', { notNull: true }),
      field('query', 'Query', enums.inputType.code, enums.dataType.text, { notNull: true }),
      emailReference({ notNull: true }),
      reference('emailDataSourceTypeId', 'Data Source Type', 'emailDataSourceTypes', 'label', {
        notNull: true,
      }),
    ],
  },
  {
    name: 'emailExecutions',
    label: 'Email Executions',
    fields: [
      id(),
      shortText('batchId', 'Batch ID', { notNull: true }),
      emailReference(),
      shortText('emailName', 'Email Name', { notNull: true }),
      shortText('trigger', 'Trigger', { notNull: true }),
      longText('to', 'To'),
      longText('cc', 'CC'),
      longText('bcc', 'BCC'),
      longText('subject', 'Subject'),
      longText('body', 'Body'),
      shortText('priority', 'Priority', { notNull: true }),
      shortText('status', 'Status', { notNull: true }),
      longText('errorMessage', 'Error Message'),
      number('attempts', 'Attempts', { notNull: true }),
      datetime('publishedAt', 'Published At'),
      datetime('sentAt', 'Sent At'),
      shortText('trackingId', 'Tracking ID'),
      json('headers', 'Headers'),
      datetime('openedAt', 'Opened At'),
      number('openCount', 'Open Count', { notNull: true }),
      datetime('clickedAt', 'Clicked At'),
      number('clickCount', 'Click Count', { notNull: true }),
      datetime('unsubscribedAt', 'Unsubscribed At'),
    ],
  },
  {
    name: 'emailClicks',
    label: 'Email Clicks',
    fields: [
      id(),
      reference('emailExecutionId', 'Email Execution', 'emailExecutions', 'emailName', {
        notNull: true,
      }),
      longText('url', 'URL', { notNull: true }),
    ],
  },
  {
    name: 'emailUnsubscribes',
    label: 'Email Unsubscribes',
    fields: [
      id(),
      emailReference({ notNull: true }),
      shortText('address', 'Address', { notNull: true }),
      reference('emailExecutionId', 'Email Execution', 'emailExecutions', 'emailName'),
    ],
  },
  {
    name: 'emailSendRequests',
    label: 'Email Send Requests',
    fields: [
      field('id', 'ID', enums.inputType.shortText, enums.dataType.varchar, {
        identity: true,
        notNull: true,
        unique: true,
      }),
      emailReference(),
      shortText('trigger', 'Trigger', { notNull: true }),
      shortText('testRecipient', 'Test Recipient'),
      shortText('status', 'Status', { notNull: true }),
      longText('errorMessage', 'Error Message'),
    ],
  },
];
