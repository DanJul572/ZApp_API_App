const db = require('@db');
const enums = require('@enums');
const authService = require('@services/authService');

async function register(req, res) {
  const t = await db.sequelize.transaction();

  try {
    const request = JSON.parse(req.body.data);

    const userData = request;
    userData.password = await authService.hashPassword(userData.password);
    const createdUser = await authService.insertUser(userData, t);

    t.commit();
    return res.status(enums.statusCode.OK).send(createdUser);
  } catch (error) {
    await t.rollback();
    return res.status(enums.statusCode.INTERNAL_SERVER_ERROR).send(error.message);
  }
}

module.exports = register;
