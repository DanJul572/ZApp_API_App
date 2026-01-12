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

function sanitaizeTableName(tableName) {
  return tableName.replace(/[^a-zA-Z0-9-_]/g, '_');
}

function getColumnNameFromFields(fields = []) {
  return fields.map(field => field.name);
}

function excelSerialToDate(serial) {
  const excelEpoch = new Date(Date.UTC(1899, 11, 30));
  return new Date(excelEpoch.getTime() + serial * 86400000);
}

function normalizeCell(cell) {
  if (!cell || cell.value === null || cell.value === '') return '';

  const v = cell.value;

  if (typeof v === 'object' && v.error) {
    return '';
  }

  if (v instanceof Date) {
    return v.toISOString();
  }

  if (typeof v === 'object' && v.formula) {
    const r = v.result;
    if (typeof r === 'number') {
      return excelSerialToDate(r).toISOString();
    }
    return String(r ?? '');
  }

  if (typeof v === 'number') {
    return String(v);
  }

  if (typeof v === 'string' && !isNaN(v)) {
    return String(v);
  }

  if (typeof v === 'object' && v.richText) {
    return v.richText.map(t => t.text).join('');
  }

  if (typeof v === 'boolean') {
    return v ? 'true' : 'false';
  }

  let str = String(v);

  if (/^[=+\-@]/.test(str)) {
    str = `'${str}`;
  }

  return str;
}

function escapeCsv(value) {
  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function getRowsMapping(columns, row) {
  if (row.cellCount < columns.length) {
    throw new Error(`Invalid column count at row ${row.number}`);
  }

  return columns.map((_, i) => escapeCsv(normalizeCell(row.getCell(i + 1)))).join(',');
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
  sanitaizeTableName,
};
