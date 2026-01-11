const multer = require('multer');

const {fileUpload} = require('../config/file');

function multerErrorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: `file to large (max ${fileUpload.maxSize}MB)`,
      });
    }
  }
  next(err);
}

module.exports = multerErrorHandler;
