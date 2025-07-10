const db = require('../models');

const authBuilder = require('../builders/authBuilder');

module.exports = {
  findByEmail(email) {
    try {
      const query = authBuilder.findByEmail();
      return db.sequelize
        .query(query, {
          bind: [email],
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

  findTokenByUserId(userId) {
    try {
      const query = authBuilder.findTokenByUserId();
      return db.sequelize
        .query(query, {
          bind: [userId],
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

  deleteTokenByUserId(userId) {
    try {
      const query = authBuilder.deleteTokenByUserId();
      return db.sequelize
        .query(query, {
          bind: [userId],
          type: db.sequelize.QueryTypes.SELECT,
        })
        .then(() => {
          return 'Token has been deleted.';
        })
        .catch(error => {
          throw new Error(error.message);
        });
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
