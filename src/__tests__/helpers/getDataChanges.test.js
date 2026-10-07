const getDataChanges = require('../../helpers/getDataChanges');

describe('getDataChanges', () => {
  it('should list only the fields whose value changed', () => {
    const oldData = { id: 1, name: 'Old', roleId: 2 };
    const newData = { id: 1, name: 'New', roleId: 2 };

    expect(getDataChanges(oldData, newData)).toEqual([
      { field: 'name', oldValue: 'Old', newValue: 'New' },
    ]);
  });

  it('should ignore createdAt and updatedAt', () => {
    const oldData = { id: 1, updatedAt: new Date('2026-01-01') };
    const newData = { id: 1, updatedAt: new Date('2026-02-01') };

    expect(getDataChanges(oldData, newData)).toEqual([]);
  });

  it('should compare dates and objects by value', () => {
    const oldData = { date: new Date('2026-01-01'), tree: [{ id: '1' }] };
    const newData = { date: new Date('2026-01-01'), tree: [{ id: '1' }] };

    expect(getDataChanges(oldData, newData)).toEqual([]);
  });

  it('should treat a missing field as null', () => {
    expect(getDataChanges({ id: 1 }, { id: 1, note: 'added' })).toEqual([
      { field: 'note', oldValue: null, newValue: 'added' },
    ]);
  });
});
