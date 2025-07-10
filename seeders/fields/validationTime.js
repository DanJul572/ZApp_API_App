const dayjs = require('dayjs');

const dataType = require('../../constats/dataType');
const inputType = require('../../constats/inputType');
const datetimeFormat = require('../../constats/datetimeFormat');
const moduleId = require('../../constats/moduleId');

const now = dayjs().format(datetimeFormat.datetime.value);

module.exports = [
  {
    moduleId: moduleId.validationTimes,
    name: 'id',
    label: 'ID',
    inputType: inputType.number,
    dataType: dataType.integer,
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
    moduleId: moduleId.validationTimes,
    name: 'label',
    label: 'Label',
    inputType: inputType.shortText,
    dataType: dataType.varchar,
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
