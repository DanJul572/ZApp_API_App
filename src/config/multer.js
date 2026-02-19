const multer = require('multer');
const { randomUUID } = require('crypto');

const fileConfig = require('./file');

const multerConfig = multer({
  storage: multer.diskStorage({
    destination: fileConfig.fileUpload.destination,
    filename: (_req, file, cb) => {
      cb(null, `${randomUUID()}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * fileConfig.fileUpload.maxSize,
  },
});

module.exports = multerConfig;
