const db = require('../../models');
const enums = require('../../enums');
const helpers = require('../../helpers');
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
      success: true,
      message: 'Registration successful',
      data: createdUser,
    });
  } catch (err) {
    await t.rollback();

    const error = helpers.getErrorResponse(err.message);
    await helpers.insertInternalError(req, error.code, error.message);

    return res.status(enums.statusCode.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: error.message,
    });
  }
}

module.exports = register;
