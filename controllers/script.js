const moduleId = require('../constats/moduleId');

const commonQuery = require('../queries/commonQuery');
const scriptQuery = require('../queries/scriptQuery');

module.exports = {
    async run(req, res) {
        const param = req.query;
        try {
            const script = await commonQuery.getRowDetail(
                moduleId.script,
                param.id,
                null,
                {
                    withValidation: false,
                },
            );
            const data = await scriptQuery.run(script.sql);

            return res.status(200).send(data);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },
};
