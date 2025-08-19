const fieldQuery = require('@queries/fieldQuery');

async function getFields(moduleId) {
  return await fieldQuery.getFields(moduleId);
}

module.exports = {
  getFields,
};
