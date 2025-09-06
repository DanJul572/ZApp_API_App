const enums = require('../enums');

function parseJsonData(req, res, next) {
  if (req.body && req.body.data) {
    try {
      const parsed = JSON.parse(req.body.data);
      req.body = parsed;
    } catch {
      return res
        .status(enums.statusCode.BAD_REQUEST)
        .json({message: 'Invalid JSON format in "data" field'});
    }
  }
  next();
}

module.exports = parseJsonData;
