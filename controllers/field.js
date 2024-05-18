const fieldQuery = require('../queries/fieldQuery');

module.exports = {
    async rows(req, res) {
        const request = req.query;
        try {
            const data = await fieldQuery.getFields(request.moduleId);
            return res.status(200).send(data);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },
};
