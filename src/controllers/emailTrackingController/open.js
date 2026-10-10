const enums = require('../../enums');
const emailTrackingService = require('../../services/emailTrackingService');

// A transparent 1x1 GIF.
const PIXEL = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

async function open(req, res, next) {
  try {
    await emailTrackingService.recordOpen(req.params.trackingId);

    res.setHeader('Content-Type', 'image/gif');
    // Every open must reach the API, not a cached copy.
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.status(enums.statusCode.OK).send(PIXEL);
  } catch (err) {
    next(err);
  }
}

module.exports = open;
