const db = require('../models');
const generalQuery = require('../queries/generalQuery');

module.exports = {
    async rows(req, res) {
        const t = await db.sequelize.transaction();
        const request = req.body;

        try {
            const data = await generalQuery.getRows(request.id, request.page, request.filter, request.sort);
            t.commit();

            return res.status(200).send(data);
        } catch (error) {
            await t.rollback();
            return res.status(500).send(error.message);
        }
    },

    async columns(req, res) {
        const t = await db.sequelize.transaction();
        const request = req.body;

        try {
            const data = await generalQuery.getColumns(request.id);
            t.commit();

            return res.status(200).send(data);
        } catch (error) {
            await t.rollback();
            return res.status(500).send(error.message);
        }
    },

    async detail(req, res) {
        const t = await db.sequelize.transaction();
        const request = req.body;

        try {
            const data = await generalQuery.getRowDetail(request.moduleId, request.id);
            t.commit();

            return res.status(200).send(data);
        } catch (error) {
            await t.rollback();
            return res.status(500).send(error.message);
        }
    },
};
