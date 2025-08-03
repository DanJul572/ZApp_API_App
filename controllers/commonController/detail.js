const jwt = require('jsonwebtoken');

const commonService = require('@services/commonService');
const helpers = require('@helpers');
const enums = require('@enums');

async function detail(req, res) {
  try {
    const request = req.query;
    const token = req.header('Authorization');
    const user = jwt.verify(token, enums.auth.secretKey);

    const module = await commonService.getModuleById(request.moduleId);
    const primaryField = await commonService.getPrimaryField(request.moduleId);

    await commonService.runValidationBefore(request, module.id, enums.actionId.detail, user);

    const data = await commonService.getDetailData(module.name, request.rowId, primaryField.name);
    return res.status(enums.statusCode.OK).send(data);
  } catch (error) {
    const response = helpers.getErrorResponse(error.message);
    await commonService.insertInternalError(req, response.code, response.message);
    return res.status(response.code).send(response.message);
  }
}

module.exports = detail;
