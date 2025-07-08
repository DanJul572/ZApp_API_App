const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const authQuery = require('../queries/authQuery');
const commonQuery = require('../queries/commonQuery');
const menuQuery = require('../queries/menuQuery');

const moduleId = require('../constats/moduleId');
const auth = require('../constats/auth');

const helper = require('../helpers');

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

async function insertToken(id, token) {
    await commonQuery.insertRow(moduleId.tokens, {
        userId: id,
        token: token,
    });
}

async function getExistingToken(id) {
    return await helper.findValidTokenForUser(id);
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
