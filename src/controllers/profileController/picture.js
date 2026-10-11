const enums = require('../../enums');
const profileService = require('../../services/profileService');

// Answers 204 when the user has no picture, so the app can show the initial instead.
async function picture(req, res, next) {
  try {
    const file = await profileService.getPicture(req.user.userId);
    if (!file) {
      return res.status(enums.statusCode.NO_CONTENT).end();
    }

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Length', file.fileBuffer.length);
    res.setHeader('Cache-Control', 'private, no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(enums.statusCode.OK).send(file.fileBuffer);
  } catch (err) {
    next(err);
  }
}

module.exports = picture;
