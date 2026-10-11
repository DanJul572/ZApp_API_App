const db = require('../models');
const { profileBuilder } = require('../builders');

async function selectOne(query, replacements, transaction) {
  try {
    const result = await db.sequelize.query(query, {
      replacements,
      transaction,
      type: db.sequelize.QueryTypes.SELECT,
    });
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
}

module.exports = {
  async getUserById(userId, transaction) {
    return await selectOne(profileBuilder.getUserById(), [userId], transaction);
  },

  async getOtherUserByEmail(email, userId, transaction) {
    return await selectOne(profileBuilder.getOtherUserByEmail(), [email, userId], transaction);
  },

  async getPicture(userId, transaction) {
    return await selectOne(profileBuilder.getPicture(), [userId], transaction);
  },

  async getPictureInfo(userId, transaction) {
    return await selectOne(profileBuilder.getPictureInfo(), [userId], transaction);
  },
};
