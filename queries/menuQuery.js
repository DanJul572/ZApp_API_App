const db = require('../models');

const menuBuilder = require('../builders/menuBuilder');

module.exports = {
    findByRoleId(roleId) {
        try {
            const query = menuBuilder.findByRoleId(roleId);
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
