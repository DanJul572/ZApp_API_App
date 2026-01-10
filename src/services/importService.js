const ExcelJS = require('exceljs');
const {PassThrough} = require('stream');

const moduleQuery = require('../queries/moduleQuery');
const fieldQuery = require('../queries/fieldQuery');
const importQuery = require('../queries/importQuery');

async function getModuleById(moduleId) {
  return await moduleQuery.getModule(moduleId);
}

async function getModuleFields(moduleId) {
  return await fieldQuery.getFields(moduleId);
}

function getColumnNameFromFields(fields) {
  if (!fields || !fields.length) {
    return false;
  }

  return fields.map(field => field.name);
}

function excelSerialToDate(serial) {
  const excelEpoch = new Date(Date.UTC(1899, 11, 30));
  return new Date(excelEpoch.getTime() + serial * 86400000);
}

function normalizeCell(cell) {
  if (!cell || cell.value === null) return '';

  let v = cell.value;

  if (typeof v === 'number' || (typeof v === 'string' && !isNaN(v))) {
    const n = Number(v);

    if (n > 20000 && n < 60000) {
      return excelSerialToDate(n).toISOString();
    }

    return String(v);
  }

  if (v instanceof Date) {
    return v.toISOString();
  }

  if (typeof v === 'object' && v.richText) {
    return v.richText.map(t => t.text).join('');
  }

  return String(v);
}

function escapeCsv(value) {
  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function getRowsMapping(columns, row) {
  return columns.map((_, index) => escapeCsv(normalizeCell(row.getCell(index + 1)))).join(',');
}

async function importExcel(filePath, options) {
  const {table, columns, mapRow} = options;

  const copyStream = await importQuery.getCopyStream(table, columns);
  const csvStream = new PassThrough();

  csvStream.pipe(copyStream);

  const workbook = new ExcelJS.stream.xlsx.WorkbookReader(filePath);

  try {
    for await (const worksheet of workbook) {
      let isHeader = true;

      for await (const row of worksheet) {
        if (isHeader) {
          isHeader = false;
          continue;
        }

        const csvLine = mapRow(row);
        if (!csvLine) continue;

        if (!csvStream.write(csvLine + '\n')) {
          await new Promise(r => csvStream.once('drain', r));
        }
      }
    }

    csvStream.end();

    await new Promise((resolve, reject) => {
      copyStream.on('finish', resolve);
      copyStream.on('error', reject);
    });
  } catch (err) {
    csvStream.destroy(err);
    copyStream.destroy(err);
    throw err;
  }
}

module.exports = {
  getColumnNameFromFields,
  getModuleById,
  getModuleFields,
  getRowsMapping,
  importExcel,
};
