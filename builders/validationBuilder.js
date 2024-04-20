module.exports = {
    getValidations(moduleId, actionId, validationTimeId) {
        return `SELECT "Scripts"."sql" FROM "Validations"
            JOIN "Scripts"
            ON "Validations"."scriptId" = "Scripts"."id"
            WHERE "Validations"."moduleId" = ${moduleId}
            AND "Validations"."actionId" = ${actionId}
            AND "Validations"."validationTimeId" = ${validationTimeId}
            ORDER BY "Validations"."id" ASC;
        `;
    },
};
