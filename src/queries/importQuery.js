const copyFrom = require('pg-copy-streams').from;

const db = require('../models');
const {importBuilder} = require('../builders');

async function getCopyStream(table, columns) {
  const connection = await db.sequelize.connectionManager.getConnection();

  try {
    await connection.query('BEGIN');

    const sql = importBuilder.getCsvStream(table, columns);
    const copyStream = connection.query(copyFrom(sql));

    let released = false;

    const release = async err => {
      if (released) return;
      released = true;

      try {
        if (err) {
          await connection.query('ROLLBACK');
        } else {
          await connection.query('COMMIT');
        }
      } finally {
        db.sequelize.connectionManager.releaseConnection(connection);
      }
    };

    copyStream.on('finish', () => release());
    copyStream.on('error', err => release(err));

    return copyStream;
  } catch (err) {
    await connection.query('ROLLBACK');
    db.sequelize.connectionManager.releaseConnection(connection);
    throw err;
  }
}

module.exports = {
  getCopyStream,
};
