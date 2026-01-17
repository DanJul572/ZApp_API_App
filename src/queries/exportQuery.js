const copyTo = require('pg-copy-streams').to;
const QueryStream = require('pg-query-stream');
const {PassThrough} = require('stream');
const fastCsv = require('fast-csv');

const db = require('../models');
const {exportBuilder} = require('../builders');

async function getPostgreCsvStream(query) {
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

async function getMysqlCsvStream(query) {
  const connection = await db.sequelize.connectionManager.getConnection();

  const queryStream = connection.query(query).stream({
    highWaterMark: 1000,
  });

  const csvStream = fastCsv.format({
    headers: true,
  });

  const output = new PassThrough();

  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    db.sequelize.connectionManager.releaseConnection(connection);
  };

  queryStream
    .on('error', err => {
      csvStream.destroy(err);
      release();
    })
    .on('end', release)
    .on('close', release);

  csvStream.on('error', err => {
    queryStream.destroy(err);
    release();
  });

  queryStream.pipe(csvStream).pipe(output);

  return output;
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
  getPostgreCsvStream,
  getMysqlCsvStream,
  getExcelStream,
};
