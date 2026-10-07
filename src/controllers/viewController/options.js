const viewService = require('../../services/viewService');
const enums = require('../../enums');

async function options(req, res, next) {
  try {
    const request = req.query;

    const options = await viewService.getOptions(request.moduleId);

    return res.status(enums.statusCode.OK).json({
      success: true,
      data: options,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = options;
