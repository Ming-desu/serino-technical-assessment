'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('money_values', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      treasure_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      amt: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
    });

    await queryInterface.addConstraint('money_values', {
      fields: ['treasure_id'],
      type: 'foreign key',
      name: 'fk_money_values_treasure_id',
      references: {
        table: 'treasures',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('money_values', 'fk_money_values_treasure_id');
    await queryInterface.dropTable('money_values');
  }
};