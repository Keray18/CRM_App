const { sequelize } = require('../config/dbConn.js')
const { DataTypes } = require('sequelize')

const Employee = sequelize.define('Employee', 
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        department: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        position: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        salary: {
            type: DataTypes.INTEGER,
            allowNull: false,

        },
        education: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        experience: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        originalPassword: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        privileged: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    }, {
        timestamps: true,
    }
)

module.exports = Employee