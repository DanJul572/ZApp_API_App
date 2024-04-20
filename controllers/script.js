const moduleId = require('../constats/moduleId');

const generalQuery = require('../queries/generalQuery');
const scriptQuery = require('../queries/scriptQuery');

module.exports = {
    async run(req, res) {
        const param = req.query;
        try {
            const script = await generalQuery.getRowDetail(moduleId.script, param.id);
            const data = await scriptQuery.run(script.sql);

            return res.status(200).send(data);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },
};
