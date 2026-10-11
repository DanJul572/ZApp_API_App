const update = require('../../../controllers/emailController/update');
const db = require('../../../models');
const emailService = require('../../../services/emailService');
const enums = require('../../../enums');

jest.mock('../../../models', () => ({ sequelize: { transaction: jest.fn() } }));
jest.mock('../../../services/emailService');

describe('emailController.update', () => {
  let req, res, next, transaction;

  beforeEach(() => {
    transaction = { commit: jest.fn(), rollback: jest.fn() };
    db.sequelize.transaction.mockResolvedValue(transaction);

    req = { body: { id: 3, name: 'New' }, files: [] };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();

    emailService.getEmailById.mockResolvedValue({ id: 3 });
    emailService.getEmailAuditData
      .mockResolvedValueOnce({ id: 3, name: 'Old' })
      .mockResolvedValueOnce({ id: 3, name: 'New' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should audit the template as it was before and after the update', async () => {
    await update(req, res, next);

    const updateOrder = emailService.updateEmail.mock.invocationCallOrder[0];
    const [before, after] = emailService.getEmailAuditData.mock.invocationCallOrder;
    expect(before).toBeLessThan(updateOrder);
    expect(after).toBeGreaterThan(updateOrder);

    expect(emailService.createEmailAuditTrail).toHaveBeenCalledWith(
      req,
      {
        action: enums.auditAction.update,
        rowId: 3,
        oldData: { id: 3, name: 'Old' },
        newData: { id: 3, name: 'New' },
      },
      transaction,
    );
    expect(transaction.commit).toHaveBeenCalled();
  });

  it('should roll back the update when the audit row cannot be written', async () => {
    emailService.createEmailAuditTrail.mockRejectedValue(new Error('audit failed'));

    await update(req, res, next);

    expect(transaction.rollback).toHaveBeenCalled();
    expect(transaction.commit).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
