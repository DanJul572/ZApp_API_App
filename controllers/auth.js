const db = require('../models');

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authQuery = require('../queries/authQuery');
const commonQuery = require('../queries/commonQuery');

const auth = require('../constats/auth');
const moduleId = require('../constats/moduleId');
const menuQuery = require('../queries/menuQuery');

function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.sendStatus(401);

    jwt.verify(token, auth.secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

async function findValidTokenForUser(userId) {
    try {
        const userToken = await authQuery.findTokenByUserId(userId);
        if (userToken) {
            const decoded = jwt.verify(userToken.token, auth.secretKey);
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
    } catch {
        return false;
    }
}

async function login(req, res) {
    const t = await db.sequelize.transaction();
    const request = JSON.parse(req.body.data);

    try {
        const user = await authQuery.findByEmail(request.email);
        const password = await bcryptjs.compare(request.password, user.password);

        if (user && password) {
            const existingToken = await findValidTokenForUser(user.id);
            if (existingToken) {
                t.commit();
                return res.json({accessToken: existingToken});
            } else {
                const tokenInfo = {
                    userId: user.id,
                    email: user.email,
                    roleId: user.roleId,
                };
                const tokenOptions = {
                    expiresIn: auth.expiredIn,
                };
                const accessToken = jwt.sign(tokenInfo, auth.secretKey, tokenOptions);

                await commonQuery.insertRow(moduleId.tokens, {
                    userId: user.id,
                    token: accessToken,
                });

                const menu = await menuQuery.findByRoleId(user.roleId);

                const response = {
                    afterLogin: menu.afterLogin,
                    accessToken: accessToken,
                };

                t.commit();

                return res.json(response);
            }
        } else {
            t.commit();
            return res.status(500).send('Invalid Email or Password');
        }
    } catch (error) {
        await t.rollback();
        return res.status(500).send(error.message);
    }
}

async function register(req, res) {
    const t = await db.sequelize.transaction();
    const request = JSON.parse(req.body.data);

    try {
        const hashedPassword = await bcryptjs.hash(request.password, auth.salt);
        request.password = hashedPassword;

        const data = await commonQuery.insertRow(moduleId.users, request);
        t.commit();

        return res.status(200).send(data);
    } catch (error) {
        await t.rollback();
        return res.status(500).send(error.message);
    }
}

async function logout(req, res) {
    const t = await db.sequelize.transaction();
    const token = req.header('Authorization');

    try {
        const decoded = jwt.verify(token, auth.secretKey);
        const result = await authQuery.deleteTokenByUserId(decoded.userId);

        t.commit();
        return res.status(200).send(result);
    } catch (error) {
        await t.rollback();
        return res.status(500).send(error.message);
    }
}

module.exports = {
    authenticateToken: authenticateToken,
    login: login,
    register: register,
    logout: logout,
};
