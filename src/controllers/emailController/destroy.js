const db = require('../../models');
const enums = require('../../enums');
const emailService = require('../../services/emailService');

async function destroy(req, res, next) {
  const t = await db.sequelize.transaction();

  try {
    const email = await emailService.getEmailById(req.body.id, t);
    if (!email) {
      await t.rollback();
      return res.status(enums.statusCode.NOT_FOUND).json({
        success: false,
        message: 'Email template not found',
      });
    }

    const oldData = await emailService.getEmailAuditData(email.id, t);

    await emailService.deleteEmail(email.id, t);

    await emailService.createEmailAuditTrail(
      req,
      {
        action: enums.auditAction.delete,
        rowId: email.id,
        oldData,
      },
      t,
    );

    await t.commit();
    return res.status(enums.statusCode.OK).json({
      success: true,
      message: 'Email template was deleted successfully',
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

module.exports = destroy;
