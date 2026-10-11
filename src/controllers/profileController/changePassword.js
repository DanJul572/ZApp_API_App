const db = require('../../models');
const enums = require('../../enums');
const respondError = require('../../helpers/respondError');
const profileService = require('../../services/profileService');

async function changePassword(req, res, next) {
  const t = await db.sequelize.transaction();

  try {
    await profileService.changePassword(req, req.user.userId, req.body, t);

    await t.commit();
    return res.status(enums.statusCode.OK).json({
      success: true,
      message: 'Password was changed successfully',
    });
  } catch (err) {
    await t.rollback();
    return respondError(err, res, next);
  }
}

module.exports = changePassword;
