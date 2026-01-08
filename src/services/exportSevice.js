const ExcelJS = require('exceljs');
const archiver = require('archiver');
const {PassThrough} = require('stream');

const enums = require('../enums');
const commonQuery = require('../queries/commonQuery');
const exportQuery = require('../queries/exportQuery');

async function getQueryData(id) {
  return await commonQuery.getRowDetail('scripts', id, 'id');
}

async function streamCsvAsZip(label, query, res) {
  const csvStream = await exportQuery.getCsvStream(query);

  const archive = archiver('zip', {
    zlib: {level: 9},
  });

  archive.on('error', err => {
    if (!res.headersSent) {
      res.status(enums.statusCode.INTERNAL_SERVER_ERROR).end();
    } else {
      res.destroy(err);
    }
  });

  res.on('close', () => archive.abort());
  res.on('aborted', () => archive.abort());

  archive.pipe(res);
  archive.append(csvStream, {name: `${label}.csv`});
  archive.finalize();
}

async function streamExcelAsZip(label, query, res) {
  const excelStream = new PassThrough();
  const rowStream = await exportQuery.getExcelStream(query);

  const archive = archiver('zip', {zlib: {level: 9}});

  archive.on('error', err => {
    if (!res.headersSent) {
      res.status(500).end();
    } else {
      res.destroy(err);
    }
  });

  res.on('close', () => archive.abort());
  res.on('aborted', () => archive.abort());

  archive.pipe(res);
  archive.append(excelStream, {name: `${label}.xlsx`});

  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    stream: excelStream,
    useStyles: false,
    useSharedStrings: false,
  });

  const worksheet = workbook.addWorksheet(label);
  let headerWritten = false;

  try {
    for await (const row of rowStream) {
      if (!headerWritten) {
        worksheet.columns = Object.keys(row).map(k => ({
          header: k,
          key: k,
        }));
        headerWritten = true;
      }

      worksheet.addRow(row).commit();
    }

    await workbook.commit();
    archive.finalize();
  } catch (err) {
    archive.abort();
    excelStream.destroy(err);
    throw err;
  }
}

module.exports = {
  getQueryData,
  streamCsvAsZip,
  streamExcelAsZip,
};
