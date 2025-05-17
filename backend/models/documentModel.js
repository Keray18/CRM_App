const { sequelize } = require('../config/dbConn.js')
const { DataTypes } = require('sequelize')

const Document = sequelize.define('Document', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    leadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cloudinaryId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    uploadedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    assignedTo: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    timestamps: true,
})

module.exports = Document 