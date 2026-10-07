const fieldService = require('../../services/fieldService');
const enums = require('../../enums');

async function rows(req, res, next) {
  try {
    const request = req.query;
    const data = await fieldService.getFields(request.moduleId);
    return res.status(enums.statusCode.OK).json({
      success: true,
      data: data,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = rows;
