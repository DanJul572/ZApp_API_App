const reportService = require('../../services/reportService');

// The web app has no access to jsreport, so it renders reports here and receives the file bytes.
async function render(req, res, next) {
  try {
    const { template, data } = req.body;

    const report = await reportService.renderTemplate(template, data);

    res.set('Content-Type', report.headers['content-type']);
    return report.pipe(res);
  } catch (err) {
    next(err);
  }
}

module.exports = render;
