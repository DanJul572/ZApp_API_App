const fileService = require('../../services/fileService');
const helpers = require('../../helpers');
const enums = require('../../enums');

async function download(req, res, next) {
  try {
    const param = req.query;

    const data = await fileService.download(param.name);

    return res.status(enums.statusCode.OK).send({
      success: true,
      data: data,
    });
  } catch (err) {
    const error = helpers.getErrorResponse(err.message);
    await helpers.createErrorLog(req, error.code, error.message);

    next(err);
  }
}

module.exports = download;
