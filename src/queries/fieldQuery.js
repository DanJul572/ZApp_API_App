const db = require('../models');
const enums = require('../enums');
const { fieldBuilder } = require('../builders');

module.exports = {
  async getFields(moduleId) {
    try {
      const query = fieldBuilder.findByModule();
      return db.sequelize
        .query(query, {
          replacements: [moduleId],
          type: db.sequelize.QueryTypes.SELECT,
        })
        .then(result => {
          if (result.length <= 0) {
            return [];
          }
          const fields = result;
          const timestampFields = [
            {
              moduleId: moduleId,
              name: 'createdAt',
              label: 'Created At',
              inputType: enums.inputType.datetime,
              dataType: enums.dataType.datetime,
              tableRef: null,
              tableRefKey: null,
              tableRefName: null,
              tableRefAlias: null,
              tableRefFilter: null,
              regex: null,
              sequence: null,
              multiSelect: false,
              identity: false,
              notNull: false,
              unique: false,
              autoIncrement: false,
            },
            {
              moduleId: moduleId,
              name: 'updatedAt',
              label: 'Updated At',
              inputType: enums.inputType.datetime,
              dataType: enums.dataType.datetime,
              tableRef: null,
              tableRefKey: null,
              tableRefName: null,
              tableRefAlias: null,
              tableRefFilter: null,
              regex: null,
              srquence: null,
              multiSelect: false,
              identity: false,
              notNull: false,
              unique: false,
              autoIncrement: false,
            },
          ];
          return fields.concat(timestampFields);
        })
        .catch(error => {
          throw new Error(error.message);
        });
    } catch (error) {
      throw new Error(error.message, { cause: error });
    }
  },

  async deleteFields(id, transaction) {
    try {
      const query = fieldBuilder.deleteByModule();
      return db.sequelize
        .query(query, {
          replacements: [id],
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

  async getPrimaryField(moduleId) {
    try {
      const query = fieldBuilder.findPrimaryField();
      return db.sequelize
        .query(query, {
          replacements: [moduleId],
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

  async getField(id) {
    try {
      const query = fieldBuilder.findById();
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
