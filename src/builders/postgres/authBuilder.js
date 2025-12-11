function findByEmail() {
  return `SELECT * FROM "users" WHERE "email" = ?;`;
}

module.exports = {
  findByEmail,
};
