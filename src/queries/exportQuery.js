const copyTo = require('pg-copy-streams').to;

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

async function streamQueryResults(query, onBatch) {
  const BATCH_SIZE = 1000;
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const rows = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
      raw: true,
      nest: false,
      offset: offset,
      limit: BATCH_SIZE,
    });

    if (rows.length === 0) {
      hasMore = false;
      break;
    }

    await onBatch(rows);

    offset += BATCH_SIZE;

    if (rows.length < BATCH_SIZE) {
      hasMore = false;
    }
  }
}

module.exports = {
  getCsvStream,
  streamQueryResults,
};
