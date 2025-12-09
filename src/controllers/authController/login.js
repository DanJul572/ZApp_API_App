const authService = require('../../services/authService');
const enums = require('../../enums');

async function login(req, res) {
  try {
    const request = req.body;

    const user = await authService.getUserByEmail(request.email);
    if (!user) {
      return res.status(enums.statusCode.NOT_FOUND).send({
        success: false,
        message: 'user not found',
      });
    }

    const passwordIsMatch = await authService.checkPassword(request.password, user.password);
    if (!passwordIsMatch) {
      return res.status(enums.statusCode.BAD_REQUEST).send({
        success: false,
        message: 'invalid password',
      });
    }

    const menu = await authService.getMenu(user.roleId);
    const newToken = authService.generateToken(user, menu);
    return res.json({
      success: true,
      message: 'successful login',
      data: {
        afterLogin: menu.afterLogin,
        accessToken: newToken,
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
