// "type" of the messages the API sends to the worker app's email request queue.
module.exports = {
  // { type, requestId }: build the emails of a row of "emailSendRequests".
  build: 'build',
  // { type, executionId }: hand a row of "emailExecutions" to the email sender app again.
  publish: 'publish',
};
