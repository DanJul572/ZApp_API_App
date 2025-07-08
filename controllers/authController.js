const db = require('../models');
const helper = require('../helpers');
const statusCode = require('../constats/statusCode');

const authService = require('../services/authService');

async function login(req, res) {
    const t = await db.sequelize.transaction();
    const request = JSON.parse(req.body.data);

    try {
        const user = await authService.getUserByEmail(request.email);
        const passwordIsMatch = await authService.checkPassword(
            request.password,
            user.password,
        );
        if (user && passwordIsMatch) {
            const menu = await authService.getMenu(user.roleId);
            const existingToken = await authService.getExistingToken(user.id);
            if (existingToken) {
                t.commit();
                return res.json({
                    accessToken: existingToken,
                    afterLogin: menu.afterLogin,
                });
            } else {
                const newToken = authService.generateToken(
                    user.id,
                    user.email,
                    user.roleId,
                );
                await authService.insertToken(user.id, newToken);
                t.commit();
                return res.json({
                    afterLogin: menu.afterLogin,
                    accessToken: newToken,
                });
            }
        } else {
            t.commit();
            return res
                .status(statusCode.BAD_REQUEST)
                .send('Invalid Email or Password');
        }
    } catch (error) {
        await t.rollback();
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(error.message);
    }
}

async function register(req, res) {
    const t = await db.sequelize.transaction();
    const request = JSON.parse(req.body.data);

    try {
        const userData = request;
        userData.password = await authService.hashPassword(userData.password);
        const createdUser = await authService.insertUser(userData);
        t.commit();
        return res.status(statusCode.OK).send(createdUser);
    } catch (error) {
        await t.rollback();
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(error.message);
    }
}

async function logout(req, res) {
    const t = await db.sequelize.transaction();
    const token = req.header('Authorization');

    try {
        const userData = helper.decodeToken(token);
        const response = authService.deleteUserToken(userData.userId);
        t.commit();
        return res.status(statusCode.OK).send(response);
    } catch (error) {
        await t.rollback();
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(error.message);
    }
}

module.exports = {
    login: login,
    register: register,
    logout: logout,
};
