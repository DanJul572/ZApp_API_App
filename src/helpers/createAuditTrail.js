const commonQuery = require('../queries/commonQuery');
const config = require('../config');
const enums = require('../enums');

const getDataChanges = require('./getDataChanges');
const getRequestInfo = require('./getRequestInfo');
const maskSensitiveData = require('./maskSensitiveData');

function toJson(value) {
  return value === null || value === undefined ? null : JSON.stringify(value);
}

function isLargeField(field) {
  return (
    field.inputType === enums.inputType.richText ||
    field.dataType === enums.dataType.json ||
    field.dataType === enums.dataType.byte
  );
}

function hasValue(value) {
  return value !== null && value !== undefined;
}

// Replaces the value of each large field with a label; an empty value is kept as it is.
function omitLargeValues(data, largeFields, label = config.audit.omittedValue) {
  if (!data) return data;

  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      largeFields.includes(key) && hasValue(value) ? label : value,
    ]),
  );
}

/**
 * Records a create, update or delete of a module row. It runs inside the caller's transaction,
 * so the audit row is only kept when the data change is committed. An update that changes
 * nothing is not recorded.
 */
async function createAuditTrail(req, audit, transaction) {
  const { module, fields, action, rowId, oldData = null, newData = null } = audit;

  const passwordFields = fields
    .filter(field => field.inputType === enums.inputType.password)
    .map(field => field.name);
  const largeFields = fields.filter(isLargeField).map(field => field.name);
  const mask = data => maskSensitiveData(data, passwordFields);
  const toSnapshot = data => toJson(omitLargeValues(mask(data), largeFields));
  const hideValue = (field, value, label) =>
    omitLargeValues(mask({ [field]: value }), largeFields, label)[field];

  let changes = null;

  if (action === enums.auditAction.update) {
    changes = getDataChanges(oldData, newData);
    if (!changes.length) return;

    // A changed password or large field is still listed, only its values are hidden.
    changes = changes.map(change => ({
      field: change.field,
      oldValue: hideValue(change.field, change.oldValue),
      newValue: hideValue(change.field, change.newValue, config.audit.omittedChangedValue),
    }));
  }

  const { userId, userName, ipAddress, userAgent } = getRequestInfo(req);

  await commonQuery.insertRow(
    'auditTrails',
    {
      moduleId: module.id,
      moduleName: module.name,
      rowId: String(rowId),
      action,
      oldData: toSnapshot(oldData),
      newData: toSnapshot(newData),
      changes: toJson(changes),
      userId,
      userName,
      ipAddress,
      userAgent,
    },
    transaction,
  );
}

module.exports = createAuditTrail;
