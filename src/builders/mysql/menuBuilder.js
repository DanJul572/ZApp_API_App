module.exports = {
  findByRoleId() {
    return 'SELECT * FROM `menus` WHERE `roleId` = ?;';
  },
};
