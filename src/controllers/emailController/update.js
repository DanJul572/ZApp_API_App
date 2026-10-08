const db = require('../../models');
const enums = require('../../enums');
const emailService = require('../../services/emailService');

async function update(req, res, next) {
  const t = await db.sequelize.transaction();

  try {
    const request = req.body;

    const email = await emailService.getEmailById(request.id, t);
    if (!email) {
      await t.rollback();
      return res.status(enums.statusCode.NOT_FOUND).json({
        success: false,
        message: 'Email template not found',
      });
    }

    await emailService.updateEmail(email.id, request, req.files, t);

    await t.commit();
    return res.status(enums.statusCode.OK).json({
      success: true,
      message: 'Email template was updated successfully',
      data: { id: email.id },
    });
  } catch (err) {
    await t.rollback();
    next(err);
  } finally {
    await emailService.removeUploadedFiles(req.files);
  }
}

module.exports = update;
