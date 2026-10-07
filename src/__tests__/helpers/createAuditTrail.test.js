const createAuditTrail = require('../../helpers/createAuditTrail');
const commonQuery = require('../../queries/commonQuery');
const enums = require('../../enums');

jest.mock('../../queries/commonQuery');

describe('createAuditTrail', () => {
  const req = {
    user: { userId: 7, userName: 'Admin' },
    ip: '127.0.0.1',
    get: () => 'jest',
  };
  const module = { id: 9, name: 'users' };
  const fields = [
    { name: 'id', identity: true, inputType: enums.inputType.number },
    { name: 'name', inputType: enums.inputType.shortText },
    { name: 'pin', inputType: enums.inputType.password },
  ];
  const transaction = {};

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should save the changes of an update in the same transaction', async () => {
    await createAuditTrail(
      req,
      {
        module,
        fields,
        action: enums.auditAction.update,
        rowId: 1,
        oldData: { id: 1, name: 'Old', pin: '1111' },
        newData: { id: 1, name: 'New', pin: '2222' },
      },
      transaction,
    );

    const [table, payload, usedTransaction] = commonQuery.insertRow.mock.calls[0];

    expect(table).toBe('auditTrails');
    expect(usedTransaction).toBe(transaction);
    expect(payload).toMatchObject({
      moduleId: 9,
      moduleName: 'users',
      rowId: '1',
      action: 'UPDATE',
      userId: 7,
      userName: 'Admin',
      ipAddress: '127.0.0.1',
      userAgent: 'jest',
    });
    expect(JSON.parse(payload.changes)).toEqual([
      { field: 'name', oldValue: 'Old', newValue: 'New' },
      { field: 'pin', oldValue: '********', newValue: '********' },
    ]);
    expect(JSON.parse(payload.newData).pin).toBe('********');
  });

  it('should skip an update that changes nothing', async () => {
    await createAuditTrail(
      req,
      {
        module,
        fields,
        action: enums.auditAction.update,
        rowId: 1,
        oldData: { id: 1, name: 'Same' },
        newData: { id: 1, name: 'Same' },
      },
      transaction,
    );

    expect(commonQuery.insertRow).not.toHaveBeenCalled();
  });

  it('should save the deleted row without changes', async () => {
    await createAuditTrail(
      req,
      {
        module,
        fields,
        action: enums.auditAction.delete,
        rowId: 1,
        oldData: { id: 1, name: 'Gone' },
      },
      transaction,
    );

    const payload = commonQuery.insertRow.mock.calls[0][1];

    expect(payload.action).toBe('DELETE');
    expect(JSON.parse(payload.oldData)).toEqual({ id: 1, name: 'Gone' });
    expect(payload.newData).toBeNull();
    expect(payload.changes).toBeNull();
  });
});
