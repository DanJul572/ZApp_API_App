const db = require('@db');
const menuBuilder = require('@builders/menuBuilder');

module.exports = {
  findByRoleId(roleId) {
    try {
      const query = menuBuilder.findByRoleId();
      return db.sequelize
        .query(query, {
          bind: [roleId],
          type: db.sequelize.QueryTypes.SELECT,
        })
        .then(result => {
          return result.length > 0 ? result[0] : null;
        })
        .catch(error => {
          throw new Error(error.message);
        });
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
