// "type" of the messages the API sends to the email sender app's email request queue.
module.exports = {
  // { type, requestId }: build the emails of a row of "emailSendRequests".
  build: 'build',
  // { type, executionId }: queue a row of "emailExecutions" to be sent again.
  publish: 'publish',
};
