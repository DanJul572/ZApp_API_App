module.exports = {
  findByEmail() {
    return `SELECT * FROM "users" WHERE "email" = ?;`;
  },
};
