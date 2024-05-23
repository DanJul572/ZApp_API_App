const db = require('../models');

const validationBuilder = require('../builders/validationBuilder');

const helpers = require('../helpers');

function getValidations(moduleId, actionId, validationTimeId) {
    try {
        const query = validationBuilder.getValidations(moduleId, actionId, validationTimeId);
        return db.sequelize
            .query(query)
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

async function runValidation(user, data, moduleId, actionId, validationTimeId) {
    try {
        const validations = await getValidations(moduleId, actionId, validationTimeId);
        if (validations && validations.length > 0) {
            for (let index = 0; index < validations.length; index++) {
                const validation = validations[index];
                validation.sql = helpers.replacePlaceholders(user, validation.sql, data);

                await db.sequelize.query(validation.sql).catch(error => {
                    throw new Error(error.message);
                });
            }
        } else {
            return;
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    getValidations,
    runValidation,
};
