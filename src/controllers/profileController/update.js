const db = require('../../models');
const enums = require('../../enums');
const respondError = require('../../helpers/respondError');
const authService = require('../../services/authService');
const profileService = require('../../services/profileService');

async function update(req, res, next) {
  const t = await db.sequelize.transaction();

  try {
    const user = await profileService.updateProfile(req, req.user.userId, req.body, req.file, t);

    await t.commit();

    // The token carries the name and email, so it is signed again with the saved values.
    res.cookie(
      'access_token',
      authService.renewToken(req.user, user),
      authService.getCookieSetting(req.user.exp),
    );

    return res.status(enums.statusCode.OK).json({
      success: true,
      message: 'Profile was updated successfully',
      data: await profileService.getProfile(user.id),
    });
  } catch (err) {
    await t.rollback();
    return respondError(err, res, next);
  }
}

module.exports = update;
