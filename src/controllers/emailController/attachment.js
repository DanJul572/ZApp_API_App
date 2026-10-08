const enums = require('../../enums');
const emailService = require('../../services/emailService');

async function attachment(req, res, next) {
  try {
    const file = await emailService.getAttachment(req.query.id);
    if (!file) {
      return res.status(enums.statusCode.NOT_FOUND).json({
        success: false,
        message: 'Attachment not found',
      });
    }

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodeURIComponent(file.fileName)}`,
    );
    return res.status(enums.statusCode.OK).send(file.fileBuffer);
  } catch (err) {
    next(err);
  }
}

module.exports = attachment;
