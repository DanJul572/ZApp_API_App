const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const authQuery = require('../queries/authQuery');
const commonQuery = require('../queries/commonQuery');
const menuQuery = require('../queries/menuQuery');

const jwtConfig = require('../config/jwt');

async function hashPassword(password) {
  return await bcryptjs.hash(password, jwtConfig.salt);
}

async function insertUser(userData, transaction) {
  return await commonQuery.insertRow('users', userData, transaction);
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

function generateToken(user, afterLogin) {
  const tokenInfo = {
    userId: user.id,
    email: user.email,
    roleId: user.roleId,
    userName: user.name,
    afterLogin: afterLogin,
  };

  const tokenOptions = {
    expiresIn: jwtConfig.expiredIn,
  };

  return jwt.sign(tokenInfo, jwtConfig.secretKey, tokenOptions);
}

function getCookieSetting() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60,
  };
}

module.exports = {
  checkPassword,
  generateToken,
  getCookieSetting,
  getMenu,
  getUserByEmail,
  hashPassword,
  insertUser,
};
