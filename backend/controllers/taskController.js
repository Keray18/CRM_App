const Task = require('../models/TaskModel.js');
const { sequelize } = require('../config/dbConn.js');

const taskController = {
    // Get all tasks
    async getAllTasks(req, res) {
        try {
            const tasks = await Task.findAll({
                order: [['assignedDate', 'DESC']]
            });

            res.status(200).json({
                message: 'Tasks retrieved successfully',
                tasks
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error retrieving tasks',
                error: error.message
            });
        }
    },

    // Create new task
    async createTask(req, res) {
        const transaction = await sequelize.transaction();
        
        try {
            console.log(req.body);
            const {
                employeeId,
                employeeName,
                taskType,
                description,
                dueDate,
                leadId,
                policyId
            } = req.body;

            // Validate required fields
            if (!employeeId || !employeeName || !taskType || !description || !dueDate) {
                await transaction.rollback();
                return res.status(400).json({
                    message: 'All required fields must be provided'
                });
            }

            // Create task
            const newTask = await Task.create({
                employeeId,
                employeeName,
                taskType,
                description,
                dueDate,
                leadId,
                policyId,
                status: 'Pending',
                assignedDate: new Date()
            }, { transaction });

            await transaction.commit();

            res.status(201).json({
                message: 'Task created successfully',
                task: newTask
            });
        } catch (error) {
            await transaction.rollback();
            
            res.status(500).json({
                message: 'Error creating task',
                error: error.message
            });
        }
    },

    // Update task status
    async updateTaskStatus(req, res) {
        const transaction = await sequelize.transaction();
        
        try {
            const { id } = req.params;
            const { status } = req.body;

            // Validate status
            if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
                await transaction.rollback();
                return res.status(400).json({
                    message: 'Invalid status value'
                });
            }

            // Find and update task
            const task = await Task.findByPk(id, { transaction });
            
            if (!task) {
                await transaction.rollback();
                return res.status(404).json({
                    message: 'Task not found'
                });
            }

            await task.update({ status }, { transaction });
            
            await transaction.commit();

            res.status(200).json({
                message: 'Task status updated successfully',
                task
            });
        } catch (error) {
            await transaction.rollback();
            
            res.status(500).json({
                message: 'Error updating task status',
                error: error.message
            });
        }
    },

    // Delete task
    async deleteTask(req, res) {
        const transaction = await sequelize.transaction();
        
        try {
            const { id } = req.params;
            
            // Find task
            const task = await Task.findByPk(id, { transaction });
            
            if (!task) {
                await transaction.rollback();
                return res.status(404).json({
                    message: 'Task not found'
                });
            }

            // Delete task
            await task.destroy({ transaction });
            
            await transaction.commit();

            res.status(200).json({
                message: 'Task deleted successfully'
            });
        } catch (error) {
            await transaction.rollback();
            
            res.status(500).json({
                message: 'Error deleting task',
                error: error.message
            });
        }
    },

    // Get tasks by employee
    async getTasksByEmployee(req, res) {
        const { employeeId } = req.params;
        const user = req.user;

        // Only allow non-admins to fetch their own tasks
        if (user.role !== 'admin' && user.id.toString() !== employeeId) {
            return res.status(403).json({ message: 'Forbidden: You can only view your own tasks.' });
        }

        try {
            const tasks = await Task.findAll({
                where: { employeeId },
                order: [['assignedDate', 'DESC']]
            });

            res.status(200).json({
                message: 'Employee tasks retrieved successfully',
                tasks
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error retrieving employee tasks',
                error: error.message
            });
        }
    }
};

module.exports = taskController; 