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
            moduleId: DataTypes.INTEGER,
            name: DataTypes.STRING,
            label: DataTypes.STRING,
            inputType: DataTypes.INTEGER,
            dataType: DataTypes.INTEGER,
            tableRef: DataTypes.STRING,
            tableRefKey: DataTypes.STRING,
            tableRefName: DataTypes.STRING,
            tableRefAlias: DataTypes.STRING,
            tableRefFilter: DataTypes.STRING,
            regex: DataTypes.STRING,
            sequence: DataTypes.INTEGER,
            multiSelect: DataTypes.BOOLEAN,
            identity: DataTypes.BOOLEAN,
            notNull: DataTypes.BOOLEAN,
            unique: DataTypes.BOOLEAN,
            autoIncrement: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'Field',
        },
    );
    return Field;
};
