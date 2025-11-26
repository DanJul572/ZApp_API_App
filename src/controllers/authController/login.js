const authService = require('../../services/authService');
const enums = require('../../enums');

async function login(req, res) {
  try {
    const request = req.body;

    const user = await authService.getUserByEmail(request.email);
    if (!user) {
      return res.status(enums.statusCode.NOT_FOUND).send('user not found');
    }

    const passwordIsMatch = await authService.checkPassword(request.password, user.password);
    if (!passwordIsMatch) {
      return res.status(enums.statusCode.BAD_REQUEST).send('invalid password');
    }

    const menu = await authService.getMenu(user.roleId);
    const newToken = authService.generateToken(user, menu);
    return res.json({
      afterLogin: menu.afterLogin,
      accessToken: newToken,
    });
  } catch (error) {
    return res.status(enums.statusCode.INTERNAL_SERVER_ERROR).send(error.message);
  }
}

module.exports = login;
