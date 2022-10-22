'use strict';

const Sequelize = require('sequelize');
const { DataTypes, Model } = Sequelize;

/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns {Model}
 */
module.exports = (sequelize, DataTypes) => {
  const Treasure = sequelize.define('Treasure', {
    id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    latitude: {
      allowNull: false,
      type: DataTypes.DECIMAL(10, 8)
    },
    longitude: {
      allowNull: false,
      type: DataTypes.DECIMAL(11, 8)
    }
  })

  return Treasure;
};
