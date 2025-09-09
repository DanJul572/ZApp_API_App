const db = require('../models');
const helpers = require('../helpers');
const {validationBuilder} = require('../builders');

function getValidations(moduleId, actionId, validationTimeId) {
  try {
    const query = validationBuilder.getValidations();
    return db.sequelize
      .query(query, {
        bind: [moduleId, actionId, validationTimeId],
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

async function runValidation(data, moduleId, actionId, validationTimeId, user = null, transaction) {
  try {
    const validations = await getValidations(moduleId, actionId, validationTimeId);
    if (validations && validations.length > 0) {
      for (let index = 0; index < validations.length; index++) {
        const validation = validations[index];
        validation.sql = helpers.replacePlaceholders(validation.sql, data, user);

        await db.sequelize
          .query(validation.sql, {
            transaction,
          })
          .catch(error => {
            throw new Error(error.message);
          });
      }
    } else {
      return;
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  getValidations,
  runValidation,
};
