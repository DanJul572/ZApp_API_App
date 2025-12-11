function findByRoleId() {
  return `SELECT * FROM "menus" WHERE "roleId" = ?;`;
}

module.exports = {
  findByRoleId,
};
