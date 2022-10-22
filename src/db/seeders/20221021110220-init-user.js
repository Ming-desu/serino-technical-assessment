'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      { id: 3000, name: 'U1', age: 21, password: bcrypt.hashSync('123123', 12), email: 'u1@kitra.abc' },
      { id: 3001, name: 'U2', age: 51, password: bcrypt.hashSync('234234', 12), email: 'u2@kitra.abc' },
      { id: 3002, name: 'U3', age: 31, password: bcrypt.hashSync('345345', 12), email: 'u3@kitra.abc' },
      { id: 3003, name: 'U4', age: 18, password: bcrypt.hashSync('456456', 12), email: 'u4@kitra.abc' },
      { id: 3004, name: 'U5', age: 21, password: bcrypt.hashSync('567567', 12), email: 'u5@kitra.abc' },
      { id: 3005, name: 'U6', age: 35, password: bcrypt.hashSync('678678', 12), email: 'u6@kitra.abc' },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
