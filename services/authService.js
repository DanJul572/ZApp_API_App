const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const authQuery = require('../queries/authQuery');
const commonQuery = require('../queries/commonQuery');
const menuQuery = require('../queries/menuQuery');

const auth = require('../enums/auth');

async function hashPassword(password) {
  return await bcryptjs.hash(password, auth.salt);
}

async function insertUser(userData) {
  return await commonQuery.insertRow('Users', userData);
}

async function getUserByEmail(email) {
  return await authQuery.findByEmail(email);
}

async function checkPassword(requestPassword, existingPassword) {
  return await bcryptjs.compare(requestPassword, existingPassword);
}

async function getMenu(roleId) {
  return await menuQuery.findByRoleId(roleId);
}

function generateToken(id, email, roleId) {
  const tokenInfo = {
    userId: id,
    email: email,
    roleId: roleId,
  };

  const tokenOptions = {
    expiresIn: auth.expiredIn,
  };

  return jwt.sign(tokenInfo, auth.secretKey, tokenOptions);
}

module.exports = {
  checkPassword,
  generateToken,
  getMenu,
  getUserByEmail,
  hashPassword,
  insertUser,
};
