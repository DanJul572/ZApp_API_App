const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const authQuery = require('../queries/authQuery');
const commonQuery = require('../queries/commonQuery');
const menuQuery = require('../queries/menuQuery');

const moduleId = require('../constats/moduleId');
const auth = require('../constats/auth');

async function hashPassword(password) {
  return await bcryptjs.hash(password, auth.salt);
}

async function insertUser(userData) {
  return await commonQuery.insertRow(moduleId.users, userData);
}

async function deleteUserToken(userId) {
  return await authQuery.deleteTokenByUserId(userId);
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

async function insertToken(tableName, id, token) {
  await commonQuery.insertRow(tableName, {
    userId: id,
    token: token,
  });
}

async function getExistingToken(id) {
  const userToken = await authQuery.findTokenByUserId(id);
  if (userToken) {
    const decoded = jwt.verify(userToken.token, process.env.JWT_SCECRET_KEY);
    const isExpired = decoded.exp < Date.now() / 1000;
    if (!isExpired) {
      return userToken.token;
    } else {
      await authQuery.deleteTokenByUserId(userToken.userId);
      return false;
    }
  } else {
    return false;
  }
}

module.exports = {
  checkPassword,
  deleteUserToken,
  generateToken,
  getExistingToken,
  getMenu,
  getUserByEmail,
  hashPassword,
  insertToken,
  insertUser,
};
