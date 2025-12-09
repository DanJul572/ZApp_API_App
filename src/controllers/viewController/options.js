const viewService = require('../../services/viewService');
const enums = require('../../enums');

async function options(req, res) {
  try {
    const request = req.query;

    const options = await viewService.getOptions(request.moduleId);

    return res.status(enums.statusCode.OK).send({
      success: true,
      data: options,
    });
  } catch (error) {
    return res.status(enums.statusCode.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: error.message,
    });
  }
}

module.exports = options;
