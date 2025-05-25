const db = require('../models');

const replacePlaceholders = require('../helpers/replacePlaceholders');

const validationBuilder = require('../builders/validationBuilder');

function getValidations(moduleId, actionId, validationTimeId) {
    try {
        const query = validationBuilder.getValidations();
        return db.sequelize
            .query(query, {
                bind: [moduleId, actionId, validationTimeId],
                type: db.sequelize.QueryTypes.SELECT,
            })
            .then(result => {
                return result.length > 0 ? result : null;
            })
            .catch(error => {
                throw new Error(error.message);
            });
    } catch (error) {
        throw new Error(error.message);
    }
}

async function runValidation(
    data,
    moduleId,
    actionId,
    validationTimeId,
    user = null,
) {
    try {
        const validations = await getValidations(
            moduleId,
            actionId,
            validationTimeId,
        );
        if (validations && validations.length > 0) {
            for (let index = 0; index < validations.length; index++) {
                const validation = validations[index];
                validation.sql = replacePlaceholders(
                    validation.sql,
                    data,
                    user,
                );

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
