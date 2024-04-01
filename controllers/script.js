const moduleId = require('../constats/moduleId');
const db = require('../models');

const generalQuery = require('../queries/generalQuery');
const scriptQuery = require('../queries/scriptQuery');

module.exports = {
    async run(req, res) {
        const t = await db.sequelize.transaction();
        const param = req.query;

        try {
            const script = await generalQuery.getRowDetail(moduleId.script, param.id);
            const data = await scriptQuery.run(script.sql);

            t.commit();

            return res.status(200).send(data);
        } catch (error) {
            await t.rollback();
            return res.status(500).send(error.message);
        }
    },
};
