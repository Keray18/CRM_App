const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const checkRole = require('../middleware/checkRole');
const authenticate = require('../middleware/authenticate');

// Get all payments
router.get('/', authenticate, checkRole(['standard', 'privileged', 'admin']), paymentController.getAllPayments);

// Get payments by policy ID
router.get('/policy/:policyId', authenticate, checkRole(['standard', 'privileged', 'admin']), paymentController.getPaymentsByPolicy);

// Get payments by filter (company, policyId, paymentType)
router.get('/filter', authenticate, checkRole(['standard', 'privileged', 'admin']), paymentController.getPaymentsByFilter);

// Create new payment
router.post('/', authenticate, checkRole(['standard', 'privileged', 'admin']), paymentController.createPayment);

// Update payment
router.put('/:id', authenticate, checkRole(['standard', 'privileged', 'admin']), paymentController.updatePayment);

// Delete payment
router.delete('/:id', authenticate, checkRole(['standard', 'privileged', 'admin']), paymentController.deletePayment);

module.exports = router; 