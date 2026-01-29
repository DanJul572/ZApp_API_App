const enums = require('../../enums');
const helpers = require('../../helpers');

async function me(req, res, next) {
  try {
    const token = req.cookies.access_token;
    const user = helpers.decodeToken(token);

    if (!user) {
      return res.status(enums.statusCode.BAD_REQUEST).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(enums.statusCode.OK).send({
      success: true,
      data: {
        userId: user.userId,
        email: user.email,
        userName: user.userName,
        roleId: user.roleId,
        afterLogin: user.afterLogin,
      },
    });
  } catch (err) {
    const error = helpers.getErrorResponse(err.message);
    await helpers.createErrorLog(req, error.code, error.message);
    next(err);
  }
}

module.exports = me;
