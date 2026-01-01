const archiver = require('archiver');

const commonQuery = require('../queries/commonQuery');
const exportQuery = require('../queries/exportQuery');

async function getQueryData(id) {
  return await commonQuery.getRowDetail('scripts', id, 'id');
}

async function getCsvStream(query) {
  return exportQuery.getCsvStream(query);
}

async function streamCsvAsZip(label, csvStream, res) {
  const archive = archiver('zip', {
    zlib: {level: 9},
  });

  archive.on('error', err => {
    throw err;
  });

  archive.append(csvStream, {name: `${label}.csv`});

  archive.pipe(res);

  return await archive.finalize();
}

module.exports = {
  getQueryData,
  getCsvStream,
  streamCsvAsZip,
};
