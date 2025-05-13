const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Get all payments
router.get('/', paymentController.getAllPayments);

// Get payments by policy ID
router.get('/policy/:policyId', paymentController.getPaymentsByPolicy);

// Get payments by filter (company, policyId, paymentType)
router.get('/filter', paymentController.getPaymentsByFilter);

// Create new payment
router.post('/', paymentController.createPayment);

// Update payment
router.put('/:id', paymentController.updatePayment);

// Delete payment
router.delete('/:id', paymentController.deletePayment);

module.exports = router; 