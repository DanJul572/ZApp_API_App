const enums = require('../../enums');
const createErrorLog = require('../../helpers/createErrorLog');
const emailTrackingService = require('../../services/emailTrackingService');
const renderPage = require('./renderPage');

async function click(req, res) {
  const { trackingId } = req.params;
  const { url, sig } = req.query;

  // Only links signed by the API are followed, so this cannot be used to redirect anywhere.
  if (typeof url !== 'string' || !emailTrackingService.isValidClick(trackingId, url, sig)) {
    return res.status(enums.statusCode.BAD_REQUEST).send(
      renderPage({
        title: 'Link not valid',
        message: 'This link is incomplete or has been changed. Please use the link in the email.',
      }),
    );
  }

  // A failure to record the click is logged, but the recipient still reaches the link.
  try {
    await emailTrackingService.recordClick(trackingId, url);
  } catch (err) {
    await createErrorLog(req, err);
  }

  return res.redirect(302, url);
}

module.exports = click;
