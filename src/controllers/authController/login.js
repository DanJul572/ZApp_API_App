const authService = require('../../services/authService');
const enums = require('../../enums');
const helpers = require('../../helpers');

async function login(req, res, next) {
  try {
    const request = req.body;

    const user = await authService.getUserByEmail(request.email);

    if (!user) {
      await helpers.createLoginAudit(req, {
        action: enums.auditAction.loginFailed,
        email: request.email,
        reason: 'User not found',
      });

      return res.status(enums.statusCode.BAD_REQUEST).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const passwordIsMatch = await authService.checkPassword(request.password, user.password);

    if (!passwordIsMatch) {
      await helpers.createLoginAudit(req, {
        action: enums.auditAction.loginFailed,
        email: user.email,
        userId: user.id,
        reason: 'Invalid password',
      });

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

    await helpers.createLoginAudit(req, {
      action: enums.auditAction.loginSuccess,
      email: user.email,
      userId: user.id,
    });

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
    next(err);
  }
}

module.exports = login;
