function getCsvStream(table) {
  return `COPY "${table}" TO STDOUT WITH CSV HEADER`;
}

module.exports = {
  getCsvStream,
};
