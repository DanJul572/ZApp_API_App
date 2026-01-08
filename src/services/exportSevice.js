const ExcelJS = require('exceljs');
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

async function streamToExcel(label, query, res) {
  const rowStream = await exportQuery.getExcelStream(query);

  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    stream: res,
    useStyles: false,
    useSharedStrings: false,
  });

  const worksheet = workbook.addWorksheet(label);

  let headerWritten = false;

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
}

module.exports = {
  getQueryData,
  getCsvStream,
  streamCsvAsZip,
  streamToExcel,
};
