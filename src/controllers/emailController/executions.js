const enums = require('../../enums');
const emailExecutionQuery = require('../../queries/emailExecutionQuery');

async function executions(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const filter = {
      status: req.query.status || null,
      emailId: parseInt(req.query.emailId) || null,
      search: req.query.search?.trim() || '',
    };

    const { rows, counts } = await emailExecutionQuery.getRows(page, filter);
    const allCounts = Object.fromEntries(
      Object.values(enums.emailExecutionStatus).map(status => [status, counts[status] || 0]),
    );
    const total = Object.values(allCounts).reduce((sum, count) => sum + count, 0);

    return res.status(enums.statusCode.OK).json({
      success: true,
      data: {
        rows,
        count: filter.status ? allCounts[filter.status] : total,
        counts: { ...allCounts, all: total },
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = executions;
