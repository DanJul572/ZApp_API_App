'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Menus', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            label: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            tree: {
                allowNull: false,
                type: Sequelize.JSON,
            },
            roleId: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            createdAt: {
                allowNull: false,
                defaultValue: Sequelize.fn('now'),
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                defaultValue: Sequelize.fn('now'),
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('Menus');
    },
};
