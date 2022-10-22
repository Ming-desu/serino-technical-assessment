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
  const MoneyValue = sequelize.define('MoneyValue', {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    treasure_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    amt: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, { tableName: 'money_values' });

  return MoneyValue;
};
