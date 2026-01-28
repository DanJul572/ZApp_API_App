const commonService = require('../../services/commonService');
const helpers = require('../../helpers');
const enums = require('../../enums');

async function menu(req, res, next) {
  try {
    const token = req.cookies.access_token;

    const user = helpers.decodeToken(token);
    const menu = await commonService.getMenu(user.roleId);

    return res.status(enums.statusCode.OK).send({
      success: true,
      data: menu,
    });
  } catch (err) {
    const error = helpers.getErrorResponse(err.message);
    await helpers.createErrorLog(req, error.code, error.message);

    if (error.code === enums.statusCode.INTERNAL_SERVER_ERROR) {
      next(err);
    } else {
      return res.status(error.code).send({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = menu;
