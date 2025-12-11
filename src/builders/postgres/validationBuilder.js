function getValidations() {
  return `SELECT "scripts"."sql" FROM "validations"
    JOIN "scripts"
    ON "validations"."scriptId" = "scripts"."id"
    WHERE "validations"."moduleId" = ?
    AND "validations"."actionId" = ?
    AND "validations"."validationTimeId" = ?
    ORDER BY "validations"."id" ASC;
  `;
}

module.exports = {
  getValidations,
};
