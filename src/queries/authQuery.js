const db = require('../models');

const {authBuilder} = require('../builders');

async function findByEmail(email) {
  try {
    const query = authBuilder.findByEmail();
    return db.sequelize
      .query(query, {
        bind: [email],
        type: db.sequelize.QueryTypes.SELECT,
      })
      .then(result => {
        return result.length > 0 ? result[0] : null;
      })
      .catch(error => {
        throw new Error(error.message);
      });
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  findByEmail,
};
