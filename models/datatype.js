'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DataType extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate() {
            // define association here
        }
    }
    DataType.init(
        {
            label: DataTypes.STRING,
            value: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'DataType',
        },
    );
    return DataType;
};
