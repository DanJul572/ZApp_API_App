const fileService = require('@services/fileService');
const enums = require('@enums');

async function download(req, res) {
  try {
    const param = req.query;

    const data = await fileService.download(param.name);

    return res.status(enums.statusCode.OK).send(data);
  } catch (error) {
    return res.status(enums.statusCode.INTERNAL_SERVER_ERROR).send(error.message);
  }
}

module.exports = {
  download,
};
