const db = require('../models');

const filesBuilder = require('../builders/filesBuilder');

module.exports = {
    save(files) {
        try {
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
    }
};
