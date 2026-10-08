const enums = require('../../enums');
const emailService = require('../../services/emailService');

async function detail(req, res, next) {
  try {
    const email = await emailService.getEmailById(req.query.id);
    if (!email) {
      return res.status(enums.statusCode.NOT_FOUND).json({
        success: false,
        message: 'Email template not found',
      });
    }

    const data = await emailService.getEmailDetail(email);

    return res.status(enums.statusCode.OK).json({
      success: true,
      data: data,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = detail;
