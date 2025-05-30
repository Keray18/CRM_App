const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController.js');
const checkRole = require('../middleware/checkRole');
const authenticate = require('../middleware/authenticate');

// Get all tasks
router.get('/', authenticate, checkRole(['standard', 'privileged', 'admin']), taskController.getAllTasks);

// Create new task
router.post('/create', authenticate, checkRole(['standard', 'privileged', 'admin']), taskController.createTask);

// Update task status
router.patch('/:id/status', authenticate, checkRole(['standard', 'privileged', 'admin']), taskController.updateTaskStatus);

// Delete task
router.delete('/:id', authenticate, checkRole(['standard', 'privileged', 'admin']), taskController.deleteTask);

// Get tasks by employee
router.get('/employee/:employeeId', authenticate, checkRole(['standard', 'privileged', 'admin']), taskController.getTasksByEmployee);

module.exports = router; 