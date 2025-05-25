const jwt = require('jsonwebtoken');

const db = require('../models');
const commonQuery = require('../queries/commonQuery');
const auth = require('../constats/auth');

const getErrorResponse = require('../helpers/getErrorResponse');
const insertError = require('../helpers/insertError');

module.exports = {
    async rows(req, res) {
        const request = JSON.parse(req.body.data);
        try {
            const data = await commonQuery.getRows(
                request.id,
                request.page,
                request.advanceFilter,
                request.filter,
                request.sort,
                request.defaultFilter,
            );
            return res.status(200).send(data);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },

    async columns(req, res) {
        const request = req.query;
        try {
            const data = await commonQuery.getColumns(request.id);
            return res.status(200).send(data);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },

    async detail(req, res) {
        const request = req.query;
        const token = req.header('Authorization');
        const user = jwt.verify(token, auth.secretKey);

        try {
            const data = await commonQuery.getRowDetail(
                request.moduleId,
                request.rowId,
                user,
            );
            return res.status(200).send(data);
        } catch (error) {
            const response = getErrorResponse(error.message);
            await insertError(req, response.code, error.message);
            return res.status(response.code).send(response.message);
        }
    },

    async delete(req, res) {
        const t = await db.sequelize.transaction();
        const request = JSON.parse(req.body.data);
        try {
            const data = await commonQuery.deleteRow(
                request.moduleId,
                request.id,
            );
            t.commit();
            return res.status(200).send(data);
        } catch (error) {
            await t.rollback();
            return res.status(500).send(error.message);
        }
    },

    async options(req, res) {
        const request = req.query;
        try {
            const data = await commonQuery.getOptions(request.id);
            return res.status(200).send(data);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },

    async create(req, res) {
        const t = await db.sequelize.transaction();
        const request = JSON.parse(req.body.data);
        const files = req.files;
        const token = req.header('Authorization');
        const user = jwt.verify(token, auth.secretKey);

        try {
            const data = await commonQuery.insertRow(
                request.moduleId,
                request.data,
                user,
                files,
            );

            t.commit();
            return res.status(200).send(data);
        } catch (error) {
            await t.rollback();
            const response = getErrorResponse(error.message);
            return res.status(response.code).send(response.message);
        }
    },

    async update(req, res) {
        const t = await db.sequelize.transaction();
        const request = JSON.parse(req.body.data);
        const files = req.files;

        try {
            const data = await commonQuery.updateRow(
                request.moduleId,
                request.rowId,
                request.data,
                files,
            );
            t.commit();
            return res.status(200).send(data);
        } catch (error) {
            await t.rollback();
            return res.status(500).send(error.message);
        }
    },

    async menu(req, res) {
        const token = req.header('Authorization');
        try {
            const decoded = jwt.verify(token, auth.secretKey);
            const data = await commonQuery.getMenu(decoded.roleId);
            return res.status(200).send(data);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },
};
