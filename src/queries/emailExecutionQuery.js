const db = require('../models');
const { emailExecutionBuilder } = require('../builders');

module.exports = {
  async insertMany(rows, transaction) {
    try {
      const { query, values } = emailExecutionBuilder.insertMany(rows);
      const [result] = await db.sequelize.query(query, {
        replacements: values,
        transaction,
        type: db.sequelize.QueryTypes.RAW,
      });
      return result;
    } catch (error) {
      throw new Error(error.message, { cause: error });
    }
  },

  async getRows(page, filter) {
    try {
      const rows = emailExecutionBuilder.getRows(page, filter);
      const counts = emailExecutionBuilder.countByStatus(filter);

      const [data, countRows] = await Promise.all([
        db.sequelize.query(rows.query, {
          replacements: rows.values,
          type: db.sequelize.QueryTypes.SELECT,
        }),
        db.sequelize.query(counts.query, {
          replacements: counts.values,
          type: db.sequelize.QueryTypes.SELECT,
        }),
      ]);

      return {
        rows: data,
        counts: Object.fromEntries(countRows.map(row => [row.status, parseInt(row.count)])),
      };
    } catch (error) {
      throw new Error(error.message, { cause: error });
    }
  },

  async getById(id) {
    try {
      const result = await db.sequelize.query(emailExecutionBuilder.getById(), {
        replacements: [id],
        type: db.sequelize.QueryTypes.SELECT,
      });
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(error.message, { cause: error });
    }
  },

  async setStatus(ids, status, errorMessage, transaction) {
    try {
      if (!ids.length) return;

      await db.sequelize.query(emailExecutionBuilder.setStatus(ids), {
        replacements: [status, errorMessage, ...ids],
        transaction,
        type: db.sequelize.QueryTypes.UPDATE,
      });
    } catch (error) {
      throw new Error(error.message, { cause: error });
    }
  },
};
