'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Views', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            moduleId: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            content: {
                type: Sequelize.JSON,
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
        await queryInterface.dropTable('Views');
    },
};
