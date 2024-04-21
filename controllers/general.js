const db = require('../models');
const jwt = require('jsonwebtoken');

const generalQuery = require('../queries/generalQuery');
const auth = require('../constats/auth');

module.exports = {
    async rows(req, res) {
        const request = req.body;
        try {
            const data = await generalQuery.getRows(request.id, request.page, request.filter, request.sort);
            return res.status(200).send(data);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },

    async columns(req, res) {
        const request = req.query;
        try {
            const data = await generalQuery.getColumns(request.id);
            return res.status(200).send(data);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },

    async detail(req, res) {
        const request = req.query;
        try {
            const data = await generalQuery.getRowDetail(request.moduleId, request.rowId);
            return res.status(200).send(data);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },

    async delete(req, res) {
        const t = await db.sequelize.transaction();
        const request = req.body;
        try {
            const data = await generalQuery.deleteRow(request.moduleId, request.id);
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
            const data = await generalQuery.getOptions(request.id);
            return res.status(200).send(data);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },

    async create(req, res) {
        const t = await db.sequelize.transaction();
        const request = req.body;
        try {
            const data = await generalQuery.insertRow(request.moduleId, request.data);
            t.commit();
            return res.status(200).send(data);
        } catch (error) {
            await t.rollback();
            return res.status(500).send(error.message);
        }
    },

    async update(req, res) {
        const t = await db.sequelize.transaction();
        const request = req.body;
        try {
            const data = await generalQuery.updateRow(request.moduleId, request.rowId, request.data);
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
            const data = await generalQuery.getMenu(decoded.roleId);
            return res.status(200).send(data);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },
};
