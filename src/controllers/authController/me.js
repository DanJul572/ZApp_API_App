const enums = require('../../enums');
const helpers = require('../../helpers');

async function me(req, res) {
  try {
    const token = req.cookies.access_token;
    const user = helpers.decodeToken(token);

    if (!user) {
      return res.status(enums.statusCode.NOT_FOUND).json({
        success: false,
        message: 'user_not_found',
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
    await helpers.insertInternalError(req, error.code, error.message);
    
    return res.status(enums.statusCode.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: error.message,
    });
  }
}

module.exports = me;
