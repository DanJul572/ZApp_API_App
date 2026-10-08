const db = require('../../models');
const enums = require('../../enums');
const emailService = require('../../services/emailService');

async function create(req, res, next) {
  const t = await db.sequelize.transaction();

  try {
    const email = await emailService.insertEmail(req.body, req.files, t);

    await t.commit();
    return res.status(enums.statusCode.CREATED).json({
      success: true,
      message: 'Email template was created successfully',
      data: { id: email.id },
    });
  } catch (err) {
    await t.rollback();
    next(err);
  } finally {
    await emailService.removeUploadedFiles(req.files);
  }
}

module.exports = create;
