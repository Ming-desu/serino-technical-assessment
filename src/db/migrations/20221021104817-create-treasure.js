'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('treasures', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      latitude: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 8)
      },
      longitude: {
        allowNull: false,
        type: Sequelize.DECIMAL(11, 8)
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('treasures');
  }
};