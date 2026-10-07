const ignoredFields = ['createdAt', 'updatedAt'];

function toComparable(value) {
  return JSON.stringify(value ?? null);
}

// Lists the fields whose value differs between two snapshots of the same row.
function getDataChanges(oldData, newData) {
  const before = oldData || {};
  const after = newData || {};
  const fieldNames = new Set([...Object.keys(before), ...Object.keys(after)]);

  return [...fieldNames]
    .filter(field => !ignoredFields.includes(field))
    .filter(field => toComparable(before[field]) !== toComparable(after[field]))
    .map(field => ({
      field,
      oldValue: before[field] ?? null,
      newValue: after[field] ?? null,
    }));
}

module.exports = getDataChanges;
