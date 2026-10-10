const enums = require('../../enums');
const emailTracking = require('../../helpers/emailTracking');
const emailExecutionQuery = require('../../queries/emailExecutionQuery');
const emailTrackingService = require('../../services/emailTrackingService');

async function execution(req, res, next) {
  try {
    const data = await emailExecutionQuery.getById(req.query.id);
    if (!data) {
      return res.status(enums.statusCode.NOT_FOUND).json({
        success: false,
        message: 'Email log not found',
      });
    }

    const clicks = await emailTrackingService.getClicks(data.id);

    return res.status(enums.statusCode.OK).json({
      success: true,
      data: { ...data, body: emailTracking.removeOpenPixel(data.body), clicks },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = execution;
