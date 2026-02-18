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
};

module.exports = builders.postgres;
