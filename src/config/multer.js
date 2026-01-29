const multer = require('multer');

const fileConfig = require('./file');

const multerConfig = multer({
  storage: multer.diskStorage({
    destination: fileConfig.fileUpload.destination,
    filename: (_req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * fileConfig.fileUpload.maxSize,
  },
});

module.exports = multerConfig;
