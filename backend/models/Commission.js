const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConn');

const Commission = sequelize.define('Commission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false
  },
  policyType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tpCommission: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  odCommission: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  addonCommission: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  effectiveCommission: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

module.exports = Commission; 