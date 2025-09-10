module.exports = {
  findByEmail() {
    return 'SELECT * FROM `Users` WHERE `email` = ?;';
  },
};
