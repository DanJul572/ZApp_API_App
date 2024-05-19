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
            queryInterface.addColumn('Fields', 'sequence', {
                allowNull: true,
                type: Sequelize.INTEGER,
            }),
            queryInterface.addColumn('Fields', 'autoIncrement', {
                allowNull: true,
                defaultValue: false,
                type: Sequelize.BOOLEAN,
            }),
        ]);
    },

    async down(queryInterface) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await Promise.all([
            queryInterface.removeColumn('Fields', 'sequence'),
            queryInterface.removeColumn('Fields', 'autoIncrement'),
        ]);
    },
};
