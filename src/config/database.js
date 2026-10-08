require('dotenv').config();

module.exports = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
  // Record executed seeders like migrations, so `db:seed:all` only runs new seeders.
  seederStorage: 'sequelize',
  seederStorageTableName: 'SequelizeData',
};
