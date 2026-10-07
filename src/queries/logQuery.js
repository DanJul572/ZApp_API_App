const db = require('../models');
const { logBuilder } = require('../builders');

module.exports = {
  async deleteExpired(table, days) {
    try {
      const query = logBuilder.deleteExpired(table);
      const [, result] = await db.sequelize.query(query, { replacements: [days] });

      return result?.rowCount ?? 0;
    } catch (error) {
      throw new Error(error.message, { cause: error });
    }
  },
};
