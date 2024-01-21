const dayjs = require('dayjs');

const dataType = require('../../constats/dataType');
const inputType = require('../../constats/inputType');
const datetimeFormat = require('../../constats/datetimeFormat');

const now = dayjs().format(datetimeFormat.datetime);

module.exports = [
    {
        moduleId: 4,
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
        createdAt: now,
        updatedAt: now,
    },
    {
        moduleId: 4,
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
        createdAt: now,
        updatedAt: now,
    },
    {
        moduleId: 4,
        name: 'value',
        label: 'Value',
        inputType: inputType.number,
        dataType: dataType.integer,
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
        createdAt: now,
        updatedAt: now,
    },
];
