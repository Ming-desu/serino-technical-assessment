'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('treasures', [
      { id: 100, name: 'T1', latitude: 14.5437648051331, longitude: 121.019911678311 },
      { id: 101, name: 'T2', latitude: 14.5532076554883, longitude: 121.055774532421 },
      { id: 102, name: 'T3', latitude: 14.5446435656183, longitude: 121.020365629871 },
      { id: 103, name: 'T4', latitude: 14.5872615919051, longitude: 120.979504794655 },
      { id: 104, name: 'T5', latitude: 14.5732032723718, longitude: 121.023090376156 },
      { id: 105, name: 'T6', latitude: 14.5231131289849, longitude: 121.019457319516 },
      { id: 106, name: 'T7', latitude: 14.6024229153284, longitude: 121.011513378939 },
      { id: 107, name: 'T8', latitude: 14.6085746293116, longitude: 121.018551395794 },
      { id: 108, name: 'T9', latitude: 14.4911143426092, longitude: 121.043748206197 },
      { id: 109, name: 'T10', latitude: 14.5445595272478, longitude: 121.106088282234 },
      { id: 110, name: 'T11', latitude: 14.5879814117365, longitude: 121.058208029763 },
      { id: 111, name: 'T12', latitude: 14.5488649285797, longitude: 121.03363929755 },
      { id: 112, name: 'T13', latitude: 14.5371505894201, longitude: 120.990430237915 },
      { id: 113, name: 'T14', latitude: 14.5257966600328, longitude: 121.020868844103 },
      { id: 114, name: 'T15', latitude: 14.5170998780454, longitude: 120.981002106201 },
      { id: 115, name: 'T16', latitude: 14.502006871058, longitude: 120.991618127534 },
      { id: 116, name: 'T17', latitude: 14.521124409049, longitude: 121.042771368704 },
      { id: 117, name: 'T18', latitude: 14.4772076562187, longitude: 120.986792724064 },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('treasures', null, {});
  }
};
