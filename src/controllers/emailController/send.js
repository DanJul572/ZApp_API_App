const enums = require('../../enums');
const emailSendService = require('../../services/emailSendService');
const respondError = require('./respondError');

async function send(req, res, next) {
  try {
    const result = await emailSendService.queueEmail(req.body.id, {
      trigger: enums.emailExecutionTrigger.manual,
    });

    const failedNote = result.failed ? `, ${result.failed} failed (see the email log)` : '';

    return res.status(enums.statusCode.OK).json({
      success: true,
      message: `${result.queued} email(s) queued${failedNote}`,
      data: result,
    });
  } catch (err) {
    return respondError(err, res, next);
  }
}

module.exports = send;
