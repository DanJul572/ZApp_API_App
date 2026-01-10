function getCsvStream(table, columns) {
  const quotedColumns = columns.map(c => `"${c}"`).join(',');

  return `
    COPY "${table}" (${quotedColumns})
    FROM STDIN
    WITH (FORMAT csv)
  `;
}

module.exports = {
  getCsvStream,
};
