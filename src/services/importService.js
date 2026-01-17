const XLSX = require('xlsx');
const {Readable} = require('stream');

const moduleQuery = require('../queries/moduleQuery');
const fieldQuery = require('../queries/fieldQuery');
const importQuery = require('../queries/importQuery');

function normalizeValue(value) {
  if (value === null || value === undefined || value === '') return '';

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [dd, mm, yyyy] = value.split('/');
    return `${yyyy}-${mm}-${dd}`;
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  return String(value);
}

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

function getRowsMapping(columns, row) {
  return columns
    .map(col => {
      const value = normalizeValue(row[col]);
      return `"${value.replace(/"/g, '""')}"`;
    })
    .join(',');
}

async function importExcel(filePath, options) {
  const {table, columns, mapRow} = options;

  const copyStream = await importQuery.getCopyStream(table, columns);

  const workbook = XLSX.readFile(filePath, {
    cellDates: true,
    raw: true,
  });

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json(worksheet, {
    defval: '',
    raw: true,
  });

  const csvStream = Readable.from(rows.map(row => mapRow(row) + '\n'));

  csvStream.pipe(copyStream);

  await new Promise((resolve, reject) => {
    copyStream.on('finish', resolve);
    copyStream.on('error', reject);
  });
}

module.exports = {
  getColumnNameFromFields,
  getModuleById,
  getModuleFields,
  getRowsMapping,
  importExcel,
  sanitaizeTableName,
};
