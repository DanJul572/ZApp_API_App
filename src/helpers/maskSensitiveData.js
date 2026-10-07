const config = require('../config');

// Replaces the value of every sensitive key, at any depth, with the mask value.
function maskSensitiveData(data, extraFieldNames = []) {
  if (Array.isArray(data)) {
    return data.map(item => maskSensitiveData(item, extraFieldNames));
  }

  if (!data || typeof data !== 'object' || data instanceof Date) {
    return data;
  }

  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      const isSensitive =
        extraFieldNames.includes(key) || config.audit.sensitiveFieldPattern.test(key);

      if (isSensitive && value !== null && value !== undefined) {
        return [key, config.audit.maskValue];
      }
      return [key, maskSensitiveData(value, extraFieldNames)];
    }),
  );
}

module.exports = maskSensitiveData;
