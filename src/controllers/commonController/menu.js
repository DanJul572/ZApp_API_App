const commonService = require('../../services/commonService');
const helpers = require('../../helpers');
const enums = require('../../enums');

async function menu(req, res) {
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
    await commonService.insertInternalError(req, error.code, error.message);
    return res.status(error.code).send({
      success: false,
      message: error.message,
    });
  }
}

module.exports = menu;
