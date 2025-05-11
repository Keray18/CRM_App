const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConn');

const Policy = sequelize.define('Policy', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Basic Information
  policyNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  insuredName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false
  },
  business: {
    type: DataTypes.ENUM('New', 'Renewal'),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('vehicle', 'health', 'travel'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Live Policy', 'Lapsed', 'Pending'),
    defaultValue: 'Live Policy'
  },

  // Vehicle Specific Fields
  vehicleType: DataTypes.STRING,
  vehicleNumber: DataTypes.STRING,
  make: DataTypes.STRING,
  model: DataTypes.STRING,
  year: DataTypes.STRING,

  // Health Specific Fields
  healthPlan: DataTypes.STRING,
  sumInsured: DataTypes.FLOAT,
  dateOfBirth: DataTypes.DATEONLY,
  height: DataTypes.FLOAT,
  weight: DataTypes.FLOAT,
  bloodGroup: DataTypes.STRING,
  preExistingConditions: {
    type: DataTypes.JSON,
    defaultValue: []
  },

  // Travel Specific Fields
  travelType: DataTypes.STRING,
  destination: DataTypes.STRING,
  tripDuration: DataTypes.INTEGER,
  passportNumber: DataTypes.STRING,

  // Premium Details
  basicPremium: DataTypes.FLOAT,
  odPremium: DataTypes.FLOAT,
  tpPremium: DataTypes.FLOAT,
  ncbDiscount: DataTypes.FLOAT,
  addonPremium: DataTypes.FLOAT,
  gst: DataTypes.FLOAT,
  totalPremium: DataTypes.FLOAT,
  netPremium: DataTypes.FLOAT,
  paymentMode: DataTypes.STRING,
  paymentReference: DataTypes.STRING,

  // Commission Details
  commissionType: DataTypes.STRING,
  odCommissionPercentage: DataTypes.FLOAT,
  tpCommissionPercentage: DataTypes.FLOAT,
  addonCommissionPercentage: DataTypes.FLOAT,
  commissionAmount: DataTypes.FLOAT,
  totalCommissionAmount: DataTypes.FLOAT,
  effectiveCommissionPercentage: DataTypes.FLOAT,

  // Documents (Optional for now)
  documents: {
    type: DataTypes.JSON,
    defaultValue: []
  },

  // Lead Reference (if converted from lead)
  leadId: DataTypes.STRING, // You can use DataTypes.INTEGER if your Lead PK is integer

}, {
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Policy; 