const enums = require('../../enums');
const emailTrackingService = require('../../services/emailTrackingService');
const renderPage = require('./renderPage');

const notFound = res =>
  res.status(enums.statusCode.NOT_FOUND).send(
    renderPage({
      title: 'Link not valid',
      message: 'This unsubscribe link is not valid. Please use the link in the email.',
    }),
  );

const doneMessage = execution =>
  `${execution.to || 'This address'} will no longer receive "${execution.emailName}".`;

/**
 * GET shows a confirmation button instead of unsubscribing at once, because mail scanners
 * open the links of incoming emails. The button posts back to the same address.
 */
async function page(req, res, next) {
  try {
    const execution = await emailTrackingService.getExecution(req.params.trackingId);
    if (!execution) return notFound(res);

    if (execution.unsubscribedAt) {
      return res
        .status(enums.statusCode.OK)
        .send(renderPage({ title: 'You are unsubscribed', message: doneMessage(execution) }));
    }

    return res.status(enums.statusCode.OK).send(
      renderPage({
        title: 'Unsubscribe',
        message: `Stop receiving "${execution.emailName}" at ${execution.to || 'this address'}?`,
        action: 'Unsubscribe',
      }),
    );
  } catch (err) {
    next(err);
  }
}

/** The confirmation button, and the one-click unsubscribe of mail clients (RFC 8058). */
async function confirm(req, res, next) {
  try {
    const execution = await emailTrackingService.unsubscribe(req.params.trackingId);
    if (!execution) return notFound(res);

    return res
      .status(enums.statusCode.OK)
      .send(renderPage({ title: 'You are unsubscribed', message: doneMessage(execution) }));
  } catch (err) {
    next(err);
  }
}

module.exports = { page, confirm };
