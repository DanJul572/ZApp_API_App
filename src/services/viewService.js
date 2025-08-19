const viewQuery = require('@queries/viewQuery');

async function getOptions(moduleId) {
  return await viewQuery.getOptions(moduleId);
}

module.exports = {
  getOptions,
};
