const fs = require('fs/promises');

// Removes what multer wrote to the temp folder once the response is sent. Files that were moved
// into the uploads folder are no longer there, so only the unused uploads are removed.
function removeTempUploads(req, res, next) {
  res.on('close', () => {
    const uploads = [].concat(req.files || [], req.file || []);
    uploads.forEach(upload => fs.rm(upload.path, { force: true }).catch(() => {}));
  });
  next();
}

module.exports = removeTempUploads;
