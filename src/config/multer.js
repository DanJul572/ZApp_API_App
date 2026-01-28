const multer = require('multer');

const file = require('./file');

const multerConfig = multer({
  storage: multer.diskStorage({
    destination: file.fileUpload.destination,
    filename: (_req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * file.fileUpload.maxSize,
  },
});

module.exports = multerConfig;
