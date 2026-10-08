const { Router } = require('express');

const config = require('../config');
const middleware = require('../middleware');
const { emailController } = require('../controllers');
const emailService = require('../services/emailService');
const emailValidation = require('../validations/emailValidation');

const router = Router();

// The controllers remove the uploaded copies once they are saved. When the request fails before
// reaching them (bad JSON, validation), they are removed here.
async function removeUploadsOnError(err, req, _res, next) {
  await emailService.removeUploadedFiles(req.files);
  next(err);
}

const uploadAttachments = [
  config.multer.array('files'),
  middleware.multerErrorHandler,
  middleware.parseJsonData,
];

router.get(
  '/email/rows',
  middleware.authenticateToken,
  middleware.validateRequest(emailValidation.getRows),
  emailController.rows,
);

router.get(
  '/email/detail',
  middleware.authenticateToken,
  middleware.validateRequest(emailValidation.getDetail),
  emailController.detail,
);

router.get(
  '/email/attachment',
  middleware.authenticateToken,
  middleware.validateRequest(emailValidation.getAttachment),
  emailController.attachment,
);

router.post(
  '/email/create',
  middleware.authenticateToken,
  ...uploadAttachments,
  middleware.validateRequest(emailValidation.create),
  emailController.create,
  removeUploadsOnError,
);

router.post(
  '/email/update',
  middleware.authenticateToken,
  ...uploadAttachments,
  middleware.validateRequest(emailValidation.update),
  emailController.update,
  removeUploadsOnError,
);

router.post(
  '/email/delete',
  middleware.authenticateToken,
  middleware.validateRequest(emailValidation.destroy),
  emailController.destroy,
);

router.post(
  '/email/send',
  middleware.authenticateToken,
  middleware.validateRequest(emailValidation.send),
  emailController.send,
);

router.post(
  '/email/send-test',
  middleware.authenticateToken,
  middleware.validateRequest(emailValidation.sendTest),
  emailController.sendTest,
);

router.get(
  '/email/executions',
  middleware.authenticateToken,
  middleware.validateRequest(emailValidation.getExecutions),
  emailController.executions,
);

router.get(
  '/email/execution',
  middleware.authenticateToken,
  middleware.validateRequest(emailValidation.getExecution),
  emailController.execution,
);

router.post(
  '/email/execution/retry',
  middleware.authenticateToken,
  middleware.validateRequest(emailValidation.retryExecution),
  emailController.retry,
);

module.exports = router;
