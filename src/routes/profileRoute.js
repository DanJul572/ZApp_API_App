const { Router } = require('express');
const multer = require('multer');

const config = require('../config');
const enums = require('../enums');
const middleware = require('../middleware');
const { profileController } = require('../controllers');
const profileValidation = require('../validations/profileValidation');

const router = Router();

// The picture is kept in memory and saved straight to the database, so no upload is left on disk.
const pictureUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * config.profile.picture.maxSize, files: 1 },
});

function pictureUploadErrorHandler(err, _req, res, next) {
  if (!(err instanceof multer.MulterError)) return next(err);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(enums.statusCode.PAYLOAD_TOO_LARGE).json({
      success: false,
      message: `Profile picture is too large (max ${config.profile.picture.maxSize}MB)`,
    });
  }

  return res.status(enums.statusCode.BAD_REQUEST).json({
    success: false,
    message: 'Only one profile picture can be uploaded',
  });
}

router.get('/profile', middleware.authenticateToken, profileController.detail);

router.get('/profile/picture', middleware.authenticateToken, profileController.picture);

router.post(
  '/profile/update',
  middleware.authenticateToken,
  pictureUpload.single('files'),
  pictureUploadErrorHandler,
  middleware.parseJsonData,
  middleware.validateRequest(profileValidation.update),
  profileController.update,
);

router.post(
  '/profile/change-password',
  middleware.authenticateToken,
  middleware.validateRequest(profileValidation.changePassword),
  profileController.changePassword,
);

module.exports = router;
