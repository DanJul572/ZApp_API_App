const jwt = require('jsonwebtoken');

const commonService = require('../../services/commonService');
const helpers = require('../../helpers');
const enums = require('../../enums');
const jwtConfig = require('../../config/jwt');

async function detail(req, res, next) {
  try {
    const request = req.query;
    const token = req.cookies.access_token;
    const user = jwt.verify(token, jwtConfig.secretKey);

    const module = await commonService.getModuleById(request.moduleId);
    const primaryField = await commonService.getPrimaryField(request.moduleId);

    await commonService.runValidationBefore(request, module.id, enums.actionId.detail, user);

    const detailData = await commonService.getDetailData(
      module.name,
      request.rowId,
      primaryField.name,
    );
    return res.status(enums.statusCode.OK).send({
      success: true,
      data: detailData,
    });
  } catch (err) {
    const error = helpers.getErrorResponse(err.message);
    await helpers.insertInternalError(req, error.code, error.message);

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

module.exports = detail;
