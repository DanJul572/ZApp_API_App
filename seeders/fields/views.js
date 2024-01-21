const dayjs = require('dayjs');

const dataType = require('../../constats/dataType');
const inputType = require('../../constats/inputType');
const datetimeFormat = require('../../constats/datetimeFormat');

const now = dayjs().format(datetimeFormat.datetime);

const list = [
    {
        moduleId: 6,
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
        moduleId: 6,
        name: 'moduleId',
        label: 'Module ID',
        inputType: inputType.dropdown,
        dataType: dataType.tableReference,
        tableRef: 'Modules',
        tableRefKey: 'id',
        tableRefName: 'name',
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
        moduleId: 6,
        name: 'content',
        label: 'Content',
        inputType: inputType.code,
        dataType: dataType.json,
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
        createdAt: now,
        updatedAt: now,
    },
];

module.exports = list;
