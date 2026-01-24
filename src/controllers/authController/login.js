const authService = require('../../services/authService');
const enums = require('../../enums');
const jwt = require('../../config/jwt');

async function login(req, res) {
  try {
    const request = req.body;

    const user = await authService.getUserByEmail(request.email);
    const passwordIsMatch = await authService.checkPassword(request.password, user.password);

    if (!user || passwordIsMatch) {
      return res.status(enums.statusCode.NOT_FOUND).send({
        success: false,
        message: 'invalid email and password',
      });
    }

    const menu = await authService.getMenu(user.roleId);
    const token = authService.generateToken(user, menu.afterLogin);
    const cookieSetting = authService.getCookieSetting();

    const expiredIn = authService.getTokenExpiredSecond(jwt.expiredIn);
    const expiredAt = authService.getTokenExpiredDate(expiredIn);

    res.cookie('access_token', token, cookieSetting);

    return res.status(enums.statusCode.OK).send({
      success: true,
      message: 'successful_login',
      data: {
        afterLogin: menu.afterLogin,
        expiredIn: expiredIn,
        expiredAt: expiredAt,
      },
    });
  } catch (error) {
    return res.status(enums.statusCode.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: error.message,
    });
  }
}

module.exports = login;
