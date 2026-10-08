const fs = require('fs/promises');

const enums = require('../enums');
const getNextRunAt = require('../helpers/getNextRunAt');
const commonQuery = require('../queries/commonQuery');
const emailQuery = require('../queries/emailQuery');

// Child rows that are rebuilt from the request on every save. Attachments are handled apart
// because the files that are kept are not sent again.
const replaceableChildTables = [
  'emailBCC',
  'emailCC',
  'emailDataSources',
  'emailSchedulers',
  'emailSettings',
  'emailTags',
];

const findKey = (map, id) => Object.keys(map).find(key => map[key] === id);

function toEmailRow(request) {
  return {
    name: request.name,
    description: request.description || null,
    to: request.to || null,
    subject: request.subject || null,
    body: request.body || null,
    design: request.design ? JSON.stringify(request.design) : null,
    useScheduler: !!request.useScheduler,
  };
}

async function insertRows(table, rows, transaction) {
  if (!rows.length) return;
  await commonQuery.insertManyRows(table, rows, transaction);
}

async function insertChildren(emailId, request, transaction) {
  await insertRows(
    'emailCC',
    (request.cc || []).map(label => ({ label, emailId })),
    transaction,
  );
  await insertRows(
    'emailBCC',
    (request.bcc || []).map(label => ({ label, emailId })),
    transaction,
  );

  const dataSources = [];
  if (request.primarySource?.sql) {
    dataSources.push({
      name: request.primarySource.name,
      query: request.primarySource.sql,
      emailId,
      emailDataSourceTypeId: enums.emailDataSourceType.primary,
    });
  }
  (request.optionalSources || []).forEach(source => {
    dataSources.push({
      name: source.name,
      query: source.sql,
      emailId,
      emailDataSourceTypeId: enums.emailDataSourceType.optional,
    });
  });
  await insertRows('emailDataSources', dataSources, transaction);

  await insertRows(
    'emailTags',
    (request.mergeTags || []).map(tag => ({
      label: tag.tag,
      value: tag.column,
      defaultValue: tag.defaultValue || null,
      emailId,
    })),
    transaction,
  );

  if (request.useScheduler && request.scheduler) {
    await commonQuery.insertRow(
      'emailSchedulers',
      {
        startTime: request.scheduler.startTime,
        endTime: request.scheduler.endTime,
        emailSchedulerTypeId: enums.emailSchedulerType[request.scheduler.type],
        // Occurrences that are already over when the template is saved are not sent.
        nextRunAt: getNextRunAt(request.scheduler.startTime, request.scheduler.type),
        emailId,
      },
      transaction,
    );
  }

  const settings = request.settings || {};
  await commonQuery.insertRow(
    'emailSettings',
    {
      openTracking: !!settings.openTracking,
      clickTracking: !!settings.clickTracking,
      unsubscribeLink: !!settings.unsubscribeLink,
      emailPriorityLevelId: enums.emailPriorityLevel[settings.priority || 'normal'],
      emailId,
    },
    transaction,
  );
}

async function insertAttachments(emailId, files, transaction) {
  if (!files?.length) return;

  const rows = await Promise.all(
    files.map(async file => ({
      fileName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      fileBuffer: await fs.readFile(file.path),
      emailId,
    })),
  );

  await commonQuery.insertManyRows('emailAttachments', rows, transaction);
}

async function getEmails(page, search) {
  return await emailQuery.getRows(page, search);
}

async function getEmailById(id, transaction) {
  return await commonQuery.getRowDetail('emails', id, 'id', transaction);
}

/**
 * Returns the email in the same shape the email builder form uses, so the form can be filled
 * straight from it.
 */
async function getEmailDetail(email) {
  const [cc, bcc, dataSources, tags, schedulers, settings, attachments] = await Promise.all([
    emailQuery.getByEmailId('emailCC', email.id),
    emailQuery.getByEmailId('emailBCC', email.id),
    emailQuery.getByEmailId('emailDataSources', email.id),
    emailQuery.getByEmailId('emailTags', email.id),
    emailQuery.getByEmailId('emailSchedulers', email.id),
    emailQuery.getByEmailId('emailSettings', email.id),
    emailQuery.getAttachments(email.id),
  ]);

  const primarySource = dataSources.find(
    source => source.emailDataSourceTypeId === enums.emailDataSourceType.primary,
  );
  const scheduler = schedulers[0];
  const setting = settings[0];

  return {
    id: email.id,
    name: email.name,
    description: email.description,
    to: email.to,
    subject: email.subject,
    body: email.body,
    design: email.design,
    useScheduler: email.useScheduler,
    createdAt: email.createdAt,
    updatedAt: email.updatedAt,
    cc: cc.map(row => row.label),
    bcc: bcc.map(row => row.label),
    primarySource: primarySource
      ? { name: primarySource.name, sql: primarySource.query }
      : { name: '', sql: '' },
    optionalSources: dataSources
      .filter(source => source.emailDataSourceTypeId === enums.emailDataSourceType.optional)
      .map(source => ({ id: source.id, name: source.name, sql: source.query })),
    mergeTags: tags.map(tag => ({
      id: tag.id,
      tag: tag.label,
      column: tag.value,
      defaultValue: tag.defaultValue || '',
    })),
    scheduler: scheduler
      ? {
          startTime: scheduler.startTime,
          endTime: scheduler.endTime,
          type: findKey(enums.emailSchedulerType, scheduler.emailSchedulerTypeId),
        }
      : null,
    settings: {
      priority: setting
        ? findKey(enums.emailPriorityLevel, setting.emailPriorityLevelId)
        : 'normal',
      openTracking: !!setting?.openTracking,
      clickTracking: !!setting?.clickTracking,
      unsubscribeLink: !!setting?.unsubscribeLink,
    },
    attachments,
  };
}

async function insertEmail(request, files, transaction) {
  const email = await commonQuery.insertRow('emails', toEmailRow(request), transaction);

  await insertChildren(email.id, request, transaction);
  await insertAttachments(email.id, files, transaction);

  return email;
}

async function updateEmail(id, request, files, transaction) {
  await commonQuery.updateRow('emails', 'id', id, toEmailRow(request), transaction);

  for (const table of replaceableChildTables) {
    await commonQuery.deleteRow(table, 'emailId', id, transaction);
  }
  await insertChildren(id, request, transaction);

  await emailQuery.deleteAttachments(id, request.keepAttachmentIds || [], transaction);
  await insertAttachments(id, files, transaction);
}

async function deleteEmail(id, transaction) {
  // Child rows are removed by the ON DELETE CASCADE foreign keys.
  return await commonQuery.deleteRow('emails', 'id', id, transaction);
}

async function getAttachment(id) {
  return await emailQuery.getAttachment(id);
}

// Multer writes uploads to disk first; once they are stored in the database the copies go.
async function removeUploadedFiles(files) {
  if (!files?.length) return;
  await Promise.all(files.map(file => fs.rm(file.path, { force: true })));
}

module.exports = {
  deleteEmail,
  getAttachment,
  getEmailById,
  getEmailDetail,
  getEmails,
  insertEmail,
  removeUploadedFiles,
  updateEmail,
};
