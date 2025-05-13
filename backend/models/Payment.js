const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConn');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  policyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'policy',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  paymentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  referenceNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Completed', 'Pending', 'Failed'),
    defaultValue: 'Pending'
  },
  paymentType: {
    type: DataTypes.ENUM('Full', 'Part'),
    defaultValue: 'Full'
  },
  remainingAmount: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Remaining amount to be paid for part payments'
  },
  totalPremium: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Total premium amount for the policy'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'payments'
});

module.exports = Payment; 