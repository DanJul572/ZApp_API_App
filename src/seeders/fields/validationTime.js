const dayjs = require('dayjs');

const enums = require('../../enums');
const dateTimeFormatConfig = require('../../config/datetimeFormat');

const now = dayjs().format(dateTimeFormatConfig.datetime.value);

module.exports = [
  {
    moduleId: enums.moduleId.validationtimes,
    name: 'id',
    label: 'ID',
    inputType: enums.inputType.number,
    dataType: enums.dataType.integer,
    tableRef: null,
    tableRefKey: null,
    tableRefName: null,
    tableRefAlias: null,
    tableRefFilter: null,
    regex: null,
    multiSelect: false,
    identity: true,
    notNull: true,
    unique: true,
    sequence: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    moduleId: enums.moduleId.validationtimes,
    name: 'label',
    label: 'Label',
    inputType: enums.inputType.shortText,
    dataType: enums.dataType.varchar,
    tableRef: null,
    tableRefKey: null,
    tableRefName: null,
    tableRefAlias: null,
    tableRefFilter: null,
    regex: null,
    multiSelect: false,
    identity: false,
    notNull: true,
    unique: false,
    sequence: 2,
    createdAt: now,
    updatedAt: now,
  },
];
