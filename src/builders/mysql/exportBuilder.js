function getCsvStream(query) {
  return `SELECT * FROM (${query}) INTO OUTFILE '/tmp/${query}.csv' FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n'`;
}

module.exports = {
  getCsvStream,
};
