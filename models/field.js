'use strict';

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Field extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  Field.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      moduleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      inputType: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dataType: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tableRef: DataTypes.STRING,
      tableRefKey: DataTypes.STRING,
      tableRefName: DataTypes.STRING,
      tableRefAlias: DataTypes.STRING,
      tableRefFilter: DataTypes.STRING,
      regex: DataTypes.STRING,
      multiSelect: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      identity: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      autoIncrement: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      notNull: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      unique: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      sequence: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Field',
      tableName: 'Fields',
      timestamps: true,
    },
    {
      sequelize,
      modelName: 'Field',
    },
  );
  return Field;
};
