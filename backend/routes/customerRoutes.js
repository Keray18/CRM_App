const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const checkRole = require('../middleware/checkRole');
const authenticate = require('../middleware/authenticate');

// Get all customers with filtering
router.get('/', authenticate, checkRole(['standard', 'privileged', 'admin']), customerController.getAllCustomers);

// Get a single customer
router.get('/:id', authenticate, checkRole(['standard', 'privileged', 'admin']), customerController.getCustomerById);

// Create a new customer
router.post('/', authenticate, checkRole(['standard', 'privileged', 'admin']), customerController.createCustomer);

// Update a customer
router.put('/:id', authenticate, checkRole(['standard', 'privileged', 'admin']), customerController.updateCustomer);

// Delete a customer
router.delete('/:id', authenticate, checkRole(['standard', 'privileged', 'admin']), customerController.deleteCustomer);

module.exports = router; 