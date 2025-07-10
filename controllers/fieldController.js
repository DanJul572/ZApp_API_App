const fieldService = require('../services/fieldService');
const statusCode = require('../constats/statusCode');

async function rows(req, res) {
    try {
        const request = req.query;

        const data = await fieldService.getFields(request.moduleId);

        return res.status(statusCode.OK).send(data);
    } catch (error) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(error.message);
    }
}

module.exports = {
    rows,
};
