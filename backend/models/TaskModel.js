const { sequelize } = require('../config/dbConn.js');
const { DataTypes } = require('sequelize');
const Policy = require('./Policy');
const Leads = require('./LeadsModel');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    employeeName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    taskType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Pending',
        validate: {
            isIn: [['Pending', 'In Progress', 'Completed']]
        }
    },
    leadId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    policyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    assignedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true,
    tableName: 'tasks',
    modelName: 'Task'
});

Task.belongsTo(Policy, { foreignKey: 'policyId', as: 'policy' });
Task.belongsTo(Leads, { foreignKey: 'leadId', as: 'lead' });

module.exports = Task; 