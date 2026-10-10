const { PassThrough } = require('stream');

const render = require('../../../controllers/reportController/render');
const reportService = require('../../../services/reportService');

// A factory keeps the real service, and with it the database models, from loading.
jest.mock('../../../services/reportService', () => ({
  renderTemplate: jest.fn(),
}));

describe('Report Render Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        template: 'invoice',
        data: { id: 1 },
      },
    };

    res = {
      set: jest.fn(),
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should stream the rendered report with its content type', async () => {
    const report = new PassThrough();
    report.headers = { 'content-type': 'application/pdf' };
    report.pipe = jest.fn();
    reportService.renderTemplate.mockResolvedValue(report);

    await render(req, res, next);

    expect(reportService.renderTemplate).toHaveBeenCalledWith('invoice', { id: 1 });
    expect(res.set).toHaveBeenCalledWith('Content-Type', 'application/pdf');
    expect(report.pipe).toHaveBeenCalledWith(res);
    expect(next).not.toHaveBeenCalled();
  });

  it('should pass a render error to next', async () => {
    const error = new Error('Template not found');
    reportService.renderTemplate.mockRejectedValue(error);

    await render(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.set).not.toHaveBeenCalled();
  });
});
