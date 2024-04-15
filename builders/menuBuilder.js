module.exports = {
    findByRoleId(roleId) {
        return `SELECT * FROM "Menus" WHERE "roleId" = '${roleId}';`;
    },
};
