const { sequelize } = require('../config/dbConn.js')
const { DataTypes } = require('sequelize')

const Leads = sequelize.define('Leads', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    leadName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    leadPhone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    leadEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    leadPolicyType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    leadCreateDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    documentUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    documentOriginalName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    timestamps: true,
    tableName: 'leads',
    modelName: 'Leads'
})

module.exports = Leads

