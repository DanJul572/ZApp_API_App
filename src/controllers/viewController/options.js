const viewService = require('../../services/viewService');
const enums = require('../../enums');

async function options(req, res) {
  try {
    const request = req.query;

    const data = await viewService.getOptions(request.moduleId);

    return res.status(enums.statusCode.OK).send(data);
  } catch (error) {
    return res.status(enums.statusCode.INTERNAL_SERVER_ERROR).send(error.message);
  }
}

module.exports = options;
