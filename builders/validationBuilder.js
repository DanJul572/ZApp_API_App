module.exports = {
  getValidations() {
    return `SELECT "Scripts"."sql" FROM "Validations"
            JOIN "Scripts"
            ON "Validations"."scriptId" = "Scripts"."id"
            WHERE "Validations"."moduleId" = $1
            AND "Validations"."actionId" = $2
            AND "Validations"."validationTimeId" = $3
            ORDER BY "Validations"."id" ASC;
        `;
  },
};
