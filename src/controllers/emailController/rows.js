const enums = require('../../enums');
const emailService = require('../../services/emailService');

async function rows(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search?.trim() || '';

    const data = await emailService.getEmails(page, search);

    return res.status(enums.statusCode.OK).json({
      success: true,
      data: data,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = rows;
