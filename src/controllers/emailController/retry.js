const enums = require('../../enums');
const emailSendService = require('../../services/emailSendService');
const respondError = require('./respondError');

async function retry(req, res, next) {
  try {
    await emailSendService.retryExecution(req.body.id);

    return res.status(enums.statusCode.OK).json({
      success: true,
      message: 'Email queued again',
    });
  } catch (err) {
    return respondError(err, res, next);
  }
}

module.exports = retry;
