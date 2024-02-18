'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await Promise.all([
            queryInterface.addColumn('Views', 'label', {
                allowNull: true,
                type: Sequelize.STRING,
            }),
            queryInterface.addColumn('Views', 'page', {
                allowNull: true,
                type: Sequelize.STRING,
            }),
        ]);
    },

    async down(queryInterface) {
        await Promise.all([queryInterface.removeColumn('Views', 'label'), queryInterface.removeColumn('Views', 'page')]);
    },
};
