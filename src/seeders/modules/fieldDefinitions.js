const enums = require('../../enums');

// Builders for the field rows of modules registered by name. Sequence is added by
// registerModules from the position in the list.

function field(name, label, inputType, dataType, options = {}) {
  return {
    name,
    label,
    inputType,
    dataType,
    tableRef: null,
    tableRefKey: null,
    tableRefName: null,
    tableRefAlias: null,
    tableRefFilter: null,
    regex: null,
    multiSelect: false,
    identity: false,
    notNull: false,
    unique: false,
    ...options,
  };
}

const id = () =>
  field('id', 'ID', enums.inputType.number, enums.dataType.integer, {
    identity: true,
    notNull: true,
    unique: true,
  });

const shortText = (name, label, options) =>
  field(name, label, enums.inputType.shortText, enums.dataType.varchar, options);

const longText = (name, label, options) =>
  field(name, label, enums.inputType.longText, enums.dataType.text, options);

const number = (name, label, options) =>
  field(name, label, enums.inputType.number, enums.dataType.integer, options);

const toggle = (name, label, options) =>
  field(name, label, enums.inputType.toggle, enums.dataType.boolean, options);

const datetime = (name, label, options) =>
  field(name, label, enums.inputType.datetime, enums.dataType.datetime, options);

const json = (name, label, options) =>
  field(name, label, enums.inputType.code, enums.dataType.json, options);

const binaryFile = (name, label, options) =>
  field(name, label, enums.inputType.file, enums.dataType.byte, options);

const reference = (name, label, tableRef, tableRefName, options) =>
  field(name, label, enums.inputType.dropdown, enums.dataType.tableReference, {
    tableRef,
    tableRefKey: 'id',
    tableRefName,
    ...options,
  });

module.exports = {
  binaryFile,
  datetime,
  field,
  id,
  json,
  longText,
  number,
  reference,
  shortText,
  toggle,
};
