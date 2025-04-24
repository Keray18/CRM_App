const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController.js');

// Get all tasks
router.get('/', taskController.getAllTasks);

// Create new task
router.post('/create', taskController.createTask);

// Update task status
router.patch('/:id/status', taskController.updateTaskStatus);

// Delete task
router.delete('/:id', taskController.deleteTask);

// Get tasks by employee
router.get('/employee/:employeeId', taskController.getTasksByEmployee);

module.exports = router; 