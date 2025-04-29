const dayjs = require('dayjs');

const dataType = require('../../constats/dataType');
const inputType = require('../../constats/inputType');
const datetimeFormat = require('../../constats/datetimeFormat');

const moduleId = require('../../constats/moduleId');

const now = dayjs().format(datetimeFormat.datetime.value);

const list = [
    {
        moduleId: moduleId.views,
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
        moduleId: moduleId.views,
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
        moduleId: moduleId.views,
        name: 'content',
        label: 'Content',
        inputType: inputType.longText,
        dataType: dataType.text,
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
