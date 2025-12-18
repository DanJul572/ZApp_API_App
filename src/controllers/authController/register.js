const db = require('../../models');
const enums = require('../../enums');
const authService = require('../../services/authService');

async function register(req, res) {
  const t = await db.sequelize.transaction();

  try {
    const request = req.body;

    const userData = request;
    userData.password = await authService.hashPassword(userData.password);
    const createdUser = await authService.insertUser(userData, t);

    await t.commit();
    return res.status(enums.statusCode.CREATED).send({
      success: false,
      message: 'registration_successful',
      data: createdUser,
    });
  } catch (error) {
    await t.rollback();
    return res.status(enums.statusCode.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: error.message,
    });
  }
}

module.exports = register;
