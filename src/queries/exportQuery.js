const copyTo = require('pg-copy-streams').to;
const QueryStream = require('pg-query-stream');

const db = require('../models');
const {exportBuilder} = require('../builders');

async function getCsvStream(query) {
  const connection = await db.sequelize.connectionManager.getConnection();
  const sql = exportBuilder.getCsvStream(query);

  const stream = connection.query(copyTo(sql));

  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    db.sequelize.connectionManager.releaseConnection(connection);
  };

  stream.on('end', release);
  stream.on('error', release);
  stream.on('close', release);

  return stream;
}

async function getExcelStream(sql) {
  const connection = await db.sequelize.connectionManager.getConnection();
  const queryStream = new QueryStream(sql);
  const stream = connection.query(queryStream);

  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    queryStream.destroy();
    db.sequelize.connectionManager.releaseConnection(connection);
  };

  stream.on('end', release);
  stream.on('error', release);
  stream.on('close', release);

  return stream;
}

module.exports = {
  getCsvStream,
  getExcelStream,
};
