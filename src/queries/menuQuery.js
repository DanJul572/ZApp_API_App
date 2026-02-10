const db = require('../models');
const { menuBuilder } = require('../builders');

module.exports = {
  findByRoleId(roleId) {
    try {
      const query = menuBuilder.findByRoleId();
      return db.sequelize
        .query(query, {
          replacements: [roleId],
          type: db.sequelize.QueryTypes.SELECT,
        })
        .then(result => {
          return result.length > 0 ? result[0] : null;
        })
        .catch(error => {
          throw new Error(error.message);
        });
    } catch (error) {
      throw new Error(error.message, { cause: error });
    }
  },
};
