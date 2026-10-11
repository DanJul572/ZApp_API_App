const db = require('../models');
const { emailBuilder } = require('../builders');

module.exports = {
  async getRows(page, search) {
    try {
      const { countQuery, countValues } = emailBuilder.getRowsCount(search);
      const { rowsQuery, rowsValues } = emailBuilder.getRows(page, search);

      const [countResult] = await db.sequelize.query(countQuery, {
        replacements: countValues,
        type: db.sequelize.QueryTypes.SELECT,
      });
      const rows = await db.sequelize.query(rowsQuery, {
        replacements: rowsValues,
        type: db.sequelize.QueryTypes.SELECT,
      });

      return {
        count: parseInt(countResult.count),
        rows,
      };
    } catch (error) {
      throw new Error(error.message, { cause: error });
    }
  },

  async getByEmailId(table, emailId, transaction) {
    try {
      const query = emailBuilder.getByEmailId(table);
      return await db.sequelize.query(query, {
        replacements: [emailId],
        transaction,
        type: db.sequelize.QueryTypes.SELECT,
      });
    } catch (error) {
      throw new Error(error.message, { cause: error });
    }
  },

  async getAttachments(emailId) {
    try {
      const query = emailBuilder.getAttachments();
      return await db.sequelize.query(query, {
        replacements: [emailId],
        type: db.sequelize.QueryTypes.SELECT,
      });
    } catch (error) {
      throw new Error(error.message, { cause: error });
    }
  },

  async getAttachment(id) {
    try {
      const query = emailBuilder.getAttachment();
      const result = await db.sequelize.query(query, {
        replacements: [id],
        type: db.sequelize.QueryTypes.SELECT,
      });
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error(error.message, { cause: error });
    }
  },

  async deleteAttachments(emailId, keepIds, transaction) {
    try {
      const query = emailBuilder.deleteAttachments(keepIds);
      return await db.sequelize.query(query, {
        replacements: [emailId, ...keepIds],
        transaction,
        type: db.sequelize.QueryTypes.DELETE,
      });
    } catch (error) {
      throw new Error(error.message, { cause: error });
    }
  },
};
