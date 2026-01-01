const archiver = require('archiver');

const moduleQuery = require('../queries/moduleQuery');
const exportQuery = require('../queries/exportQuery');

async function getModuleById(moduleId) {
  return await moduleQuery.getModule(moduleId);
}

async function getCsvStream(tableName) {
  return exportQuery.getCsvStream(tableName);
}

async function streamCsvAsZip(moduleName, csvStream, res) {
  const archive = archiver('zip', {
    zlib: {level: 9},
  });

  archive.on('error', err => {
    throw err;
  });

  archive.append(csvStream, {name: `${moduleName}.csv`});

  archive.pipe(res);

  return await archive.finalize();
}

module.exports = {
  getModuleById,
  getCsvStream,
  streamCsvAsZip,
};
