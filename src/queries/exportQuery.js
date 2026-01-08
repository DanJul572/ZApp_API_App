const copyTo = require('pg-copy-streams').to;
const QueryStream = require('pg-query-stream');

const db = require('../models');
const {exportBuilder} = require('../builders');

async function getCsvStream(query) {
  const connection = await db.sequelize.connectionManager.getConnection();

  const sql = exportBuilder.getCsvStream(query);

  const stream = connection.query(copyTo(sql));

  stream.on('end', () => {
    db.sequelize.connectionManager.releaseConnection(connection);
  });

  stream.on('error', () => {
    db.sequelize.connectionManager.releaseConnection(connection);
  });

  return stream;
}

async function getExcelStream(sql) {
  const connection = await db.sequelize.connectionManager.getConnection();
  const client = connection;

  const queryStream = new QueryStream(sql);
  const stream = client.query(queryStream);

  stream.on('end', () => {
    db.sequelize.connectionManager.releaseConnection(connection);
  });

  stream.on('error', () => {
    db.sequelize.connectionManager.releaseConnection(connection);
  });

  return stream;
}

module.exports = {
  getCsvStream,
  getExcelStream,
};
