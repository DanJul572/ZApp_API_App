const db = require('../models');
const dataType = require('../constats/dataType');
const inputType = require('../constats/inputType');
const fieldBuilder = require('../builders/fieldBuilder');

module.exports = {
  async getFields(moduleId) {
    try {
      const query = fieldBuilder.findByModule();
      return db.sequelize
        .query(query, {
          bind: [moduleId],
          type: db.sequelize.QueryTypes.SELECT,
        })
        .then(result => {
          if (result.length <= 0) return [];
          const fields = result;
          const timestampFields = [
            {
              moduleId: moduleId,
              name: 'createdAt',
              label: 'Created At',
              inputType: inputType.datetime,
              dataType: dataType.datetime,
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
              inputType: inputType.datetime,
              dataType: dataType.datetime,
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
      throw new Error(error.message);
    }
  },

  async deleteFields(id) {
    try {
      const query = fieldBuilder.deleteByModule();
      return db.sequelize
        .query(query, {
          bind: [id],
          type: db.sequelize.QueryTypes.SELECT,
        })
        .catch(error => {
          throw new Error(error.message);
        });
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async getPrimaryField(moduleId) {
    try {
      const query = fieldBuilder.findPrimaryField();
      return db.sequelize
        .query(query, {
          bind: [moduleId],
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

  async getField(id) {
    try {
      const query = fieldBuilder.findById();
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
