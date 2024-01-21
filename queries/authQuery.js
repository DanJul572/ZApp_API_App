const db = require('../models');

const authBuilder = require('../builders/authBuilder');

module.exports = {
    findByEmail(email) {
        try {
            const query = authBuilder.findByEmail(email);
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

    findTokenByUserId(userId, email) {
        try {
            const query = authBuilder.findTokenByUserId(userId, email);
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

    deleteTokenByUserId(userId) {
        try {
            const query = authBuilder.deleteTokenByUserId(userId);
            return db.sequelize
                .query(query)
                .then(() => {
                    return 'Token has been deleted.';
                })
                .catch(error => {
                    throw new Error(error.message);
                });
        } catch (error) {
            throw new Error(error.message);
        }
    },
};
