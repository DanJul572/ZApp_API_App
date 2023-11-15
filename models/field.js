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
            name: DataTypes.STRING,
            label: DataTypes.STRING,
            dataTypeId: DataTypes.INTEGER,
            tableRef: DataTypes.STRING,
            tableRefKey: DataTypes.STRING,
            tableRefName: DataTypes.STRING,
            multiSelect: DataTypes.BOOLEAN,
            identity: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'Field',
        },
    );
    return Field;
};
