function getCsvStream(query) {
  return `COPY (${query}) TO STDOUT WITH CSV HEADER`;
}

module.exports = {
  getCsvStream,
};
