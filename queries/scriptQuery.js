const db = require('../models');

module.exports = {
  run(sql) {
    try {
      return db.sequelize
        .query(sql)
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
