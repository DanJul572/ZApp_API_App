const enums = require('../../enums');
const emailSendService = require('../../services/emailSendService');
const respondError = require('./respondError');

async function sendTest(req, res, next) {
  try {
    const result = await emailSendService.queueEmail(req.body.id, {
      trigger: enums.emailExecutionTrigger.test,
      testRecipient: req.body.recipient.trim(),
    });

    return res.status(enums.statusCode.OK).json({
      success: true,
      message: 'Test email queued',
      data: result,
    });
  } catch (err) {
    return respondError(err, res, next);
  }
}

module.exports = sendTest;
