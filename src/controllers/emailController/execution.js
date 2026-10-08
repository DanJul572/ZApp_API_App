const enums = require('../../enums');
const emailExecutionQuery = require('../../queries/emailExecutionQuery');

async function execution(req, res, next) {
  try {
    const data = await emailExecutionQuery.getById(req.query.id);
    if (!data) {
      return res.status(enums.statusCode.NOT_FOUND).json({
        success: false,
        message: 'Email log not found',
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

module.exports = execution;
