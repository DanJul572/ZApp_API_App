const enums = require('../../enums');
const profileService = require('../../services/profileService');

async function detail(req, res, next) {
  try {
    const data = await profileService.getProfile(req.user.userId);
    if (!data) {
      return res.status(enums.statusCode.NOT_FOUND).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(enums.statusCode.OK).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = detail;
