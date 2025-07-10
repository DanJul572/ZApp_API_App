const fileService = require('../services/fileService');
const statusCode = require('../constats/statusCode');

async function download(req, res) {
    try {
        const param = req.query;

        const data = await fileService.download(param.name);

        return res.status(statusCode.OK).send(data);
    } catch (error) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(error.message);
    }
}

module.exports = {
    download,
};
