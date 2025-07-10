const fileQuery = require('../queries/fileQuery');

async function download(name) {
    return await fileQuery.download(name);
}

module.exports = {
    download,
};
