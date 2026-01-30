const authService = require('../../services/authService');
const enums = require('../../enums');
const helpers = require('../../helpers');

async function login(req, res, next) {
  try {
    const request = req.body;

    const user = await authService.getUserByEmail(request.email);

    if (!user) {
      return res.status(enums.statusCode.BAD_REQUEST).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const passwordIsMatch = await authService.checkPassword(request.password, user.password);

    if (!passwordIsMatch) {
      return res.status(enums.statusCode.BAD_REQUEST).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const menu = await authService.getMenu(user.roleId);
    const token = authService.generateToken(user, menu.afterLogin);
    const cookieSetting = authService.getCookieSetting();

    const expiredIn = authService.getTokenExpiredSecond();
    const expiredAt = authService.getTokenExpiredDate(expiredIn);

    res.cookie('access_token', token, cookieSetting);

    return res.status(enums.statusCode.OK).json({
      success: true,
      message: 'You have successfully logged in',
      data: {
        afterLogin: menu.afterLogin,
        expiredIn: expiredIn,
        expiredAt: expiredAt,
      },
    });
  } catch (err) {
    const error = helpers.getErrorResponse(err.message);
    await helpers.createErrorLog(req, error.code, error.message);
    next(err);
  }
}

module.exports = login;
