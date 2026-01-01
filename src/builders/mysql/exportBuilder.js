function getCsvStream(table) {
  return `SELECT * FROM "${table}" INTO OUTFILE '/tmp/${table}.csv' FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n'`;
}

module.exports = {
  getCsvStream,
};
