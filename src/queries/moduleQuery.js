const db = require('../models');
const {moduleBuilder} = require('../builders');

module.exports = {
  async createTable(name, fields, transaction) {
    try {
      const query = moduleBuilder.createTable(name, fields);
      return db.sequelize
        .query(query, {
          transaction,
        })
        .catch(error => {
          throw new Error(error.message);
        });
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async dropTable(table, sequence, transaction) {
    try {
      const query = moduleBuilder.deleteTable(table, sequence);
      return db.sequelize
        .query(query, {
          transaction,
        })
        .catch(error => {
          throw new Error(error.message);
        });
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async getModule(id) {
    try {
      const query = moduleBuilder.findOne();
      return db.sequelize
        .query(query, {
          bind: [id],
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
