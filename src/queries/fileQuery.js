const db = require('../models');
const enums = require('../enums');
const {fileBuilder} = require('../builders');

module.exports = {
  save(files, moduleId, transaction) {
    try {
      if (!files || !files.length) return;

      const {query, values} = fileBuilder.save(files, moduleId);

      return db.sequelize
        .query(query, {
          replacements: values,
          transaction,
          type: db.sequelize.QueryTypes.SELECT,
        })
        .catch(error => {
          throw new Error(error.message);
        });
    } catch (error) {
      throw new Error(error.message);
    }
  },

  delete(fields, row, transaction) {
    try {
      const fileFields = fields.filter(field => field.inputType === enums.inputType.file);

      if (!fileFields || !fileFields.length || !row) return;

      const deletedFiles = fileFields.map(field => row[field.name]);
      const query = fileBuilder.delete(deletedFiles);

      return db.sequelize
        .query(query, {
          replacements: deletedFiles,
          transaction,
          type: db.sequelize.QueryTypes.DELETE,
        })
        .catch(error => {
          throw new Error(error.message);
        });
    } catch (error) {
      throw new Error(error.message);
    }
  },

  deleteByModuleId(moduleId, transaction) {
    try {
      const query = fileBuilder.deleteByModuleId(moduleId);

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
      throw new Error(error.message);
    }
  },

  download(name) {
    try {
      const query = fileBuilder.download();

      return db.sequelize
        .query(query, {
          replacements: [name],
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
