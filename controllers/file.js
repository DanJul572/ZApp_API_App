const fileQuery = require('../queries/fileQuery');

module.exports = {
    async download(req, res) {
        const param = req.query;
        try {
            const data = await fileQuery.download(param.name);
            return res.status(200).send(data);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },
};
