const authService = require('../../services/authService');
const enums = require('../../enums');
const jwt = require('../../config/jwt');

async function login(req, res) {
  try {
    const request = req.body;

    const user = await authService.getUserByEmail(request.email);
    if (!user) {
      return res.status(enums.statusCode.NOT_FOUND).send({
        success: false,
        message: 'user_not_found',
      });
    }

    const passwordIsMatch = await authService.checkPassword(request.password, user.password);
    if (!passwordIsMatch) {
      return res.status(enums.statusCode.BAD_REQUEST).send({
        success: false,
        message: 'invalid_password',
      });
    }

    const menu = await authService.getMenu(user.roleId);
    const token = authService.generateToken(user);
    const cookieSetting = authService.getCookieSetting();

    const expiredIn = authService.getTokenExpiredSecond(jwt.expiredIn);
    const expiredAt = authService.getTokenExpiredDate(expiredIn);

    res.cookie('access_token', token, cookieSetting);

    return res.json({
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
