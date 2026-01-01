const copyTo = require('pg-copy-streams').to;

const db = require('../models');
const {exportBuilder} = require('../builders');

async function getCsvStream(table) {
  const connection = await db.sequelize.connectionManager.getConnection();

  const sql = exportBuilder.getCsvStream(table);

  const stream = connection.query(copyTo(sql));

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
};
