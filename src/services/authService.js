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

function getTokenInfo(user, afterLogin) {
  return {
    userId: user.id,
    email: user.email,
    roleId: user.roleId,
    userName: user.name,
    afterLogin: afterLogin,
  };
}

function generateToken(user, afterLogin) {
  const tokenOptions = {
    expiresIn: jwtConfig.expiredIn,
  };

  return jwt.sign(getTokenInfo(user, afterLogin), jwtConfig.secretKey, tokenOptions);
}

/**
 * Signs a token with the user's current name and email that expires together with the token the
 * request came with, so changing the profile does not lengthen the session.
 */
function renewToken(currentToken, user) {
  return jwt.sign(
    { ...getTokenInfo(user, currentToken.afterLogin), exp: currentToken.exp },
    jwtConfig.secretKey,
  );
}

// Pass the token's "exp" (in seconds) to keep the cookie only as long as that token is valid.
function getCookieSetting(expiresAt) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: expiresAt ? Math.max(expiresAt * 1000 - Date.now(), 0) : 1000 * 60 * 60,
  };
}

function getTokenExpiredSecond() {
  const regex = /^(\d+)([smhd])$/;
  const match = jwtConfig.expiredIn.match(regex);

  if (!match) {
    throw new Error('Invalid expiredIn Format');
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  let seconds;

  switch (unit) {
    case 's':
      seconds = value;
      break;
    case 'm':
      seconds = value * 60;
      break;
    case 'h':
      seconds = value * 60 * 60;
      break;
    case 'd':
      seconds = value * 60 * 60 * 24;
      break;
    default:
      throw new Error('ExpiredIn unit not recognized');
  }

  return seconds;
}

function getTokenExpiredDate(seconds) {
  return new Date(Date.now() + seconds * 1000);
}

module.exports = {
  checkPassword,
  generateToken,
  getCookieSetting,
  getMenu,
  getTokenExpiredDate,
  getTokenExpiredSecond,
  getUserByEmail,
  hashPassword,
  insertUser,
  renewToken,
};
