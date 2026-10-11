const enums = require('../../enums');
const emailSendService = require('../../services/emailSendService');
const respondError = require('./respondError');

async function send(req, res, next) {
  try {
    const result = await emailSendService.requestSend(req.body.id, {
      trigger: enums.emailExecutionTrigger.manual,
    });

    return res.status(enums.statusCode.OK).json({
      success: true,
      message: 'The email is being prepared',
      data: result,
    });
  } catch (err) {
    return respondError(err, res, next);
  }
}

module.exports = send;
