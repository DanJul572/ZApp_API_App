const commonService = require('@services/commonService');
const helpers = require('@helpers');
const enums = require('@enums');

async function menu(req, res) {
  try {
    const token = req.header('Authorization');

    const user = helpers.decodeToken(token);
    const data = await commonService.getMenu(user.roleId);

    return res.status(enums.statusCode.OK).send(data);
  } catch (error) {
    const response = helpers.getErrorResponse(error.message);
    await commonService.insertInternalError(req, response.code, response.message);
    return res.status(response.code).send(response.message);
  }
}

module.exports = menu;
