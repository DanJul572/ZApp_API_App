module.exports = {
  getValidations() {
    return `SELECT "scripts"."sql" FROM "validations"
      JOIN "scripts"
      ON "validations"."scriptId" = "scripts"."id"
      WHERE "validations"."moduleId" = $1
      AND "validations"."actionId" = $2
      AND "validations"."validationTimeId" = $3
      ORDER BY "validations"."id" ASC;
    `;
  },
};
