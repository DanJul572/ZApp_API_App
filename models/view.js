'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class View extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            View.belongsTo(models.Module, {
                foreignKey: 'moduleId',
                as: 'module',
            });
        }
    }
    View.init(
        {
            moduleId: DataTypes.STRING,
            content: DataTypes.JSON,
        },
        {
            sequelize,
            modelName: 'View',
        },
    );
    return View;
};
