const db = require('../models');
const { fileBuilder } = require('../builders');

module.exports = {
  save(files, transaction) {
    try {
      const { query, values } = fileBuilder.save(files);

      return db.sequelize
        .query(query, {
          replacements: values,
          transaction,
          type: db.sequelize.QueryTypes.INSERT,
        })
        .catch(error => {
          throw new Error(error.message);
        });
    } catch (error) {
      throw new Error(error.message, { cause: error });
    }
  },

  // Returns the deleted rows, so their files can be removed from the disk.
  deleteByIds(ids, transaction) {
    try {
      const query = fileBuilder.deleteByIds(ids);

      return db.sequelize
        .query(query, {
          replacements: ids,
          transaction,
          type: db.sequelize.QueryTypes.SELECT,
        })
        .catch(error => {
          throw new Error(error.message);
        });
    } catch (error) {
      throw new Error(error.message, { cause: error });
    }
  },

  deleteByModuleId(moduleId, transaction) {
    try {
      const query = fileBuilder.deleteByModuleId();

      return db.sequelize
        .query(query, {
          replacements: [moduleId],
          transaction,
          type: db.sequelize.QueryTypes.DELETE,
        })
        .catch(error => {
          throw new Error(error.message);
        });
    } catch (error) {
      throw new Error(error.message, { cause: error });
    }
  },

  findById(id) {
    try {
      const query = fileBuilder.findById();

      return db.sequelize
        .query(query, {
          replacements: [id],
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
