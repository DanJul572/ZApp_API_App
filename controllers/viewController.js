const viewService = require('../services/viewService');
const statusCode = require('../constats/statusCode');

async function options(req, res) {
  try {
    const request = req.query;

    const data = await viewService.getOptions(request.moduleId);

    return res.status(statusCode.OK).send(data);
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(error.message);
  }
}

module.exports = {
  options,
};
