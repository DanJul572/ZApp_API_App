const fileService = require('../../services/fileService');
const enums = require('../../enums');

// Returns the file's details; the file itself is read from its public path under /uploads.
async function detail(req, res, next) {
  try {
    const data = await fileService.getFile(req.query.id);

    if (!data) {
      return res.status(enums.statusCode.NOT_FOUND).json({
        success: false,
        message: 'File not found',
      });
    }

    return res.status(enums.statusCode.OK).json({
      success: true,
      data: data,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = detail;
