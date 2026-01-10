function getCsvStream(table, columns) {
  return `
    LOAD DATA LOCAL INFILE '/dev/stdin'
    INTO TABLE ${table}
    FIELDS TERMINATED BY ','
    ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
    (${columns.join(',')})
  `;
}

module.exports = {
  getCsvStream,
};
