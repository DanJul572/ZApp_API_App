const fileUpload = {
  // Multer writes incoming files here. Files of module rows are moved into `storage` once saved.
  destination: 'tmp/uploads/',
  // Served publicly at /uploads, as uploads/<module>/<field>/<file id>.<extension>.
  storage: 'uploads',
  maxSize: 100,
};

module.exports = {
  fileUpload,
};
