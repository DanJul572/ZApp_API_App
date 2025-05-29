const db = require('../models');

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authQuery = require('../queries/authQuery');
const commonQuery = require('../queries/commonQuery');

const auth = require('../constats/auth');
const moduleId = require('../constats/moduleId');
const menuQuery = require('../queries/menuQuery');

const findValidTokenForUser = require('../helpers/findValidTokenForUser');

async function login(req, res) {
    const t = await db.sequelize.transaction();
    const request = JSON.parse(req.body.data);

    try {
        const user = await authQuery.findByEmail(request.email);
        const password = await bcryptjs.compare(
            request.password,
            user.password,
        );
        const menu = await menuQuery.findByRoleId(user.roleId);

        if (user && password) {
            const existingToken = await findValidTokenForUser(user.id);
            if (existingToken) {
                t.commit();
                return res.json({
                    accessToken: existingToken,
                    afterLogin: menu.afterLogin,
                });
            } else {
                const tokenInfo = {
                    userId: user.id,
                    email: user.email,
                    roleId: user.roleId,
                };
                const tokenOptions = {
                    expiresIn: auth.expiredIn,
                };
                const accessToken = jwt.sign(
                    tokenInfo,
                    auth.secretKey,
                    tokenOptions,
                );

                await commonQuery.insertRow(moduleId.tokens, {
                    userId: user.id,
                    token: accessToken,
                });

                t.commit();

                return res.json({
                    afterLogin: menu.afterLogin,
                    accessToken: accessToken,
                });
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
    login: login,
    register: register,
    logout: logout,
};
