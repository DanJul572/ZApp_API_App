module.exports = {
  findByRoleId() {
    return `SELECT * FROM "Menus" WHERE "roleId" = $1;`;
  },
};
