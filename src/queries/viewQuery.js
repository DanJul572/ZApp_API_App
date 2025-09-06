const db = require('../models');
const viewBuilder = require('../builders/viewBuilder');

async function getOptions(moduleId) {
  try {
    const query = viewBuilder.getOptions();
    return await db.sequelize
      .query(query, {
        bind: [moduleId],
        type: db.sequelize.QueryTypes.SELECT,
      })
      .then(result => {
        return result.length > 0 ? result : null;
      })
      .catch(error => {
        throw new Error(error.message);
      });
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  getOptions,
};
