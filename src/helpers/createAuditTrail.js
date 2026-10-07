const commonQuery = require('../queries/commonQuery');
const enums = require('../enums');

const getDataChanges = require('./getDataChanges');
const getRequestInfo = require('./getRequestInfo');
const maskSensitiveData = require('./maskSensitiveData');

function toJson(value) {
  return value === null || value === undefined ? null : JSON.stringify(value);
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
  const mask = data => maskSensitiveData(data, passwordFields);

  let changes = null;

  if (action === enums.auditAction.update) {
    changes = getDataChanges(oldData, newData);
    if (!changes.length) return;

    // A changed password is still listed, only its values are hidden.
    changes = changes.map(change => ({
      field: change.field,
      oldValue: mask({ [change.field]: change.oldValue })[change.field],
      newValue: mask({ [change.field]: change.newValue })[change.field],
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
      oldData: toJson(mask(oldData)),
      newData: toJson(mask(newData)),
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
