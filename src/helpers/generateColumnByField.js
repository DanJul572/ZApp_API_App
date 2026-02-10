async function generateColumnByField(fields) {
  try {
    let columns = fields.map(field => {
      return {
        accessorKey: field.name,
        header: field.label,
        size: 100,
        minSize: 100,
        maxSize: 200,
        type: field.inputType,
        identity: field.identity,
      };
    });
    return columns;
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
}

module.exports = generateColumnByField;
