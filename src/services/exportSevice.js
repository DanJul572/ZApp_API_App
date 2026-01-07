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
  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    stream: res,
    useStyles: false,
    useSharedStrings: false,
  });

  const MAX_ROWS_PER_SHEET = 1000000;
  let currentSheet = null;
  let rowCount = 0;
  let sheetNumber = 1;
  let columns = null;

  await exportQuery.streamQueryResults(query, async rows => {
    for (const row of rows) {
      if (!currentSheet || rowCount >= MAX_ROWS_PER_SHEET) {
        if (currentSheet) await currentSheet.commit();

        currentSheet = workbook.addWorksheet(`Data_${sheetNumber++}`);

        if (!columns) {
          columns = Object.keys(row).map(key => ({
            header: key,
            key: key,
            width: 15,
          }));
        }

        currentSheet.columns = columns;
        rowCount = 0;
      }

      currentSheet.addRow(row).commit();
      rowCount++;
    }
  });

  if (currentSheet) await currentSheet.commit();
  await workbook.commit();
}

module.exports = {
  getQueryData,
  getCsvStream,
  streamCsvAsZip,
  streamToExcel,
};
