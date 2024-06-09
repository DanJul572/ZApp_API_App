const db = require('../models');

const filesBuilder = require('../builders/filesBuilder');

const inputType = require('../constats/inputType');

module.exports = {
    save(files) {
        try {
            if (!files || !files.length) return;

            const {query, values} = filesBuilder.save(files);

            return db.sequelize
                .query(query, {
                    bind: values,
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
    delete(fields, row) {
        try {
            const fileFields = fields.filter(field => field.inputType === inputType.file);

            if (!fileFields || !fileFields.length || !row) return;

            const deletedFiles = fileFields.map(field => row[field.name]);
            const query = filesBuilder.delete(deletedFiles);

            return db.sequelize
                .query(query, {
                    bind: deletedFiles,
                    type: db.sequelize.QueryTypes.DELETE,
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
    download(name) {
        try {
            const query = filesBuilder.download();

            return db.sequelize
                .query(query, {
                    bind: [name],
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
