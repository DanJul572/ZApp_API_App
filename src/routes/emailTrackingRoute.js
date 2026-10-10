const { Router } = require('express');

const { emailTrackingController } = require('../controllers');

const router = Router();

// Opened from the recipients' mail clients, so there is no login. The tracking id is a random
// uuid, and tracked links are signed.
router.get('/email/track/open/:trackingId', emailTrackingController.open);

router.get('/email/track/click/:trackingId', emailTrackingController.click);

router.get('/email/track/unsubscribe/:trackingId', emailTrackingController.unsubscribe.page);

router.post('/email/track/unsubscribe/:trackingId', emailTrackingController.unsubscribe.confirm);

module.exports = router;
