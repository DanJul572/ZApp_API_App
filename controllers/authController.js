const db = require('@db');
const enums = require('@enums');
const authService = require('@services/authService');

async function login(req, res) {
  try {
    const request = JSON.parse(req.body.data);

    const user = await authService.getUserByEmail(request.email);
    const passwordIsMatch = await authService.checkPassword(request.password, user.password);

    if (user && passwordIsMatch) {
      const menu = await authService.getMenu(user.roleId);
      const newToken = authService.generateToken(user.id, user.email, user.roleId);

      return res.json({
        afterLogin: menu.afterLogin,
        accessToken: newToken,
      });
    } else {
      return res.status(enums.statusCode.BAD_REQUEST).send('Invalid Email or Password');
    }
  } catch (error) {
    return res.status(enums.statusCode.INTERNAL_SERVER_ERROR).send(error.message);
  }
}

async function register(req, res) {
  const t = await db.sequelize.transaction();

  try {
    const request = JSON.parse(req.body.data);

    const userData = request;
    userData.password = await authService.hashPassword(userData.password);
    const createdUser = await authService.insertUser(userData);

    t.commit();
    return res.status(enums.statusCode.OK).send(createdUser);
  } catch (error) {
    await t.rollback();
    return res.status(enums.statusCode.INTERNAL_SERVER_ERROR).send(error.message);
  }
}

module.exports = {
  login: login,
  register: register,
};
