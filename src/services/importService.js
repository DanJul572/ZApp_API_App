const ExcelJS = require('exceljs');

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

async function getModuleById(moduleId) {
  return await moduleQuery.getModule(moduleId);
}

async function getModuleFields(moduleId) {
  return await fieldQuery.getFields(moduleId);
}

async function importExcel(filePath, options) {
  const { table, columns, mapRow } = options;

  const copyStream = await importQuery.getCopyStream(table, columns);

  const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(filePath, {
    entries: 'emit',
    worksheets: 'emit',
    sharedStrings: 'cache',
    styles: 'cache',
  });

  for await (const worksheet of workbookReader) {
    let isHeader = true;

    for await (const row of worksheet) {
      if (isHeader) {
        isHeader = false;
        continue;
      }

      const mapped = mapRow(row.values);
      if (mapped) {
        copyStream.write(mapped + '\n');
      }
    }

    break;
  }

  copyStream.end();

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
