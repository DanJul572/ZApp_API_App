function getOptions() {
  return `SELECT "id" AS "value", "label" AS "label" FROM "views" WHERE "moduleId" = ?`;
}

module.exports = {
  getOptions,
};
