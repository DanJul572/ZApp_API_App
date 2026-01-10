const copyFrom = require('pg-copy-streams').from;

const db = require('../models');
const {importBuilder} = require('../builders');

async function getCopyStream(table, columns) {
  const connection = await db.sequelize.connectionManager.getConnection();

  const sql = importBuilder.getCsvStream(table, columns);

  const stream = connection.query(copyFrom(sql));

  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    db.sequelize.connectionManager.releaseConnection(connection);
  };

  stream.on('finish', release);
  stream.on('error', release);
  stream.on('close', release);

  return stream;
}

module.exports = {
  getCopyStream,
};
