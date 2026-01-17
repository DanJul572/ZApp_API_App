const enums = require('../../enums');
const {decodeToken} = require('../../helpers');

async function me(req, res) {
  try {
    const token = req.cookies.access_token;
    const user = decodeToken(token);

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
  } catch (error) {
    return res.status(enums.statusCode.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: error.message,
    });
  }
}

module.exports = me;
