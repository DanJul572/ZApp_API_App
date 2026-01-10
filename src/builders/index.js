const dialect = process.env.DB_DIALECT || 'postgres';

const builders = {
  postgres: {
    authBuilder: require('./postgres/authBuilder'),
    commonBuilder: require('./postgres/commonBuilder'),
    exportBuilder: require('./postgres/exportBuilder'),
    fieldBuilder: require('./postgres/fieldBuilder'),
    fileBuilder: require('./postgres/fileBuilder'),
    importBuilder: require('./postgres/importBuilder'),
    menuBuilder: require('./postgres/menuBuilder'),
    moduleBuilder: require('./postgres/moduleBuilder'),
    validationBuilder: require('./postgres/validationBuilder'),
    viewBuilder: require('./postgres/viewBuilder'),
  },
  mysql: {
    authBuilder: require('./mysql/authBuilder'),
    commonBuilder: require('./mysql/commonBuilder'),
    exportBuilder: require('./mysql/exportBuilder'),
    fieldBuilder: require('./mysql/fieldBuilder'),
    fileBuilder: require('./mysql/fileBuilder'),
    importBuilder: require('./mysql/importBuilder'),
    menuBuilder: require('./mysql/menuBuilder'),
    moduleBuilder: require('./mysql/moduleBuilder'),
    validationBuilder: require('./mysql/validationBuilder'),
    viewBuilder: require('./mysql/viewBuilder'),
  },
};

module.exports = builders[dialect];
