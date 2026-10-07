const moduleId = require('../enums/moduleId');

module.exports = {
  // Log modules can be listed and viewed through the common endpoints, but never changed.
  readOnlyModuleIds: [moduleId.auditTrails, moduleId.auditLogins, moduleId.logErrors],

  // Values of these fields (and of every password-type field) are hidden in audit snapshots
  // and error log request bodies.
  sensitiveFieldPattern: /pass(word)?|token|secret/i,
  maskValue: '********',

  // Request bodies larger than this are cut before they are written to the error log.
  maxRequestBodyLength: 10000,
};
