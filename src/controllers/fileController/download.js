const fileService = require('../../services/fileService');
const enums = require('../../enums');

async function download(req, res, next) {
  try {
    const param = req.query;

    const data = await fileService.download(param.name);

    return res.status(enums.statusCode.OK).json({
      success: true,
      data: data,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = download;
