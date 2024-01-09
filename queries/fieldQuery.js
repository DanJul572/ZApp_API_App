const db = require('../models');
const dataType = require('../constats/dataType');
const inputType = require('../constats/inputType');
const fieldBuilder = require('../builders/fieldBuilder');

module.exports = {
    async getFields(id) {
        try {
            const query = fieldBuilder.findByModule(id);
            return db.sequelize
                .query(query)
                .then(result => {
                    if (result.length <= 0) return [];
                    const fields = result[0];
                    const timestampFields = [
                        {
                            moduleId: id,
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
                            multiSelect: false,
                            identity: false,
                            notNull: false,
                            unique: false,
                        },
                        {
                            moduleId: id,
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
                            multiSelect: false,
                            identity: false,
                            notNull: false,
                            unique: false,
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
            const query = fieldBuilder.deleteByModule(id);
            return db.sequelize.query(query).catch(error => {
                throw new Error(error.message);
            });
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async getPrimaryField(id) {
        try {
            const query = fieldBuilder.findPrimaryField(id);
            return db.sequelize
                .query(query)
                .then(result => {
                    return result.length > 0 ? result[0][0].name : null;
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
            const query = fieldBuilder.findById(id);
            return db.sequelize
                .query(query)
                .then(result => {
                    return result.length > 0 ? result[0][0] : null;
                })
                .catch(error => {
                    throw new Error(error.message);
                });
        } catch (error) {
            throw new Error(error.message);
        }
    },
};
