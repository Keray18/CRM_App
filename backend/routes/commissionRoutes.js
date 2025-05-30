const express = require('express');
const router = express.Router();
const commissionController = require('../controllers/commissionController');
const checkRole = require('../middleware/checkRole');
const authenticate = require('../middleware/authenticate');

// Get all commissions
router.get('/', authenticate, checkRole(['admin']), commissionController.getAllCommissions);
// Get commissions by filter (company, policyType)
router.get('/filter', authenticate, checkRole(['admin']), commissionController.getCommissionsByFilter);
// Create new commission
router.post('/', checkRole(['admin']), commissionController.createCommission);
// Update commission
router.put('/:id', checkRole(['admin']), commissionController.updateCommission);
// Delete commission
router.delete('/:id', checkRole(['admin']), commissionController.deleteCommission);
// Get commission breakdown for a company
router.get('/breakdown/:company', authenticate, checkRole(['admin']), commissionController.getCompanyCommissionBreakdown);

module.exports = router; 