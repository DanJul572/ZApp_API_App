const viewQuery = require('../queries/viewQuery');

module.exports = {
    async options(req, res) {
        const request = req.query;
        try {
            const data = await viewQuery.getOptions(request.moduleId);
            return res.status(200).send(data);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },
};
