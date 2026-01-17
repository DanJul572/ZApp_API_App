const ExcelJS = require('exceljs');
const archiver = require('archiver');
const {PassThrough} = require('stream');

const databaseConfig = require('../config/database');
const enums = require('../enums');
const commonQuery = require('../queries/commonQuery');
const exportQuery = require('../queries/exportQuery');

function sanitaize(label) {
  return label.replace(/[^a-zA-Z0-9-_]/g, '_');
}

async function getQueryData(id) {
  return await commonQuery.getRowDetail('scripts', id, 'id');
}

async function streamCsvAsZip(label, query, res) {
  let csvStream = null;
  if (databaseConfig.dialect === 'postgres') {
    csvStream = await exportQuery.getPostgreCsvStream(query);
  } else {
    csvStream = await exportQuery.getMysqlCsvStream(query);
  }

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
  await archive.finalize();
}

async function streamExcelAsZip(label, query, res) {
  const excelStream = new PassThrough();
  const rowStream = await exportQuery.getExcelStream(query);

  const archive = archiver('zip', {zlib: {level: 9}});

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
  archive.append(excelStream, {name: `${label}.xlsx`});

  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    stream: excelStream,
    useStyles: false,
    useSharedStrings: false,
  });

  const worksheet = workbook.addWorksheet(label);
  let headerWritten = false;
  let hasData = false;

  try {
    for await (const row of rowStream) {
      if (!headerWritten) {
        worksheet.columns = Object.keys(row).map(k => ({
          header: k,
          key: k,
        }));
        headerWritten = true;
      }
      hasData = true;
      worksheet.addRow(row).commit();
    }

    if (!hasData) {
      worksheet.addRow(['No data']).commit();
    }

    await workbook.commit();
    await archive.finalize();
  } catch (err) {
    archive.abort();
    excelStream.destroy(err);
    throw err;
  }
}

module.exports = {
  sanitaize,
  getQueryData,
  streamCsvAsZip,
  streamExcelAsZip,
};
