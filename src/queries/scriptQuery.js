const db = require('../models');

function run(sql) {
  try {
    return db.sequelize
      .query(sql)
      .then(result => {
        return result.length > 0 ? result[0] : null;
      })
      .catch(error => {
        throw new Error(error.message);
      });
  } catch (error) {
    throw new Error(error.message);
  }
}

async function executeDataSchema(schema) {
  const result = {};

  for (const [key, config] of Object.entries(schema)) {
    const [rows] = await db.sequelize.query(config.sql, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (config.singleResult) {
      result[key] = Array.isArray(rows) ? rows[0] : rows;
    } else {
      result[key] = rows;
    }
  }
  return result;
}

module.exports = {
  run,
  executeDataSchema,
};
