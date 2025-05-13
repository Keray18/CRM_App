const express = require('express');
const router = express.Router();
const commissionController = require('../controllers/commissionController');

// Get all commissions
router.get('/', commissionController.getAllCommissions);
// Get commissions by filter (company, policyType)
router.get('/filter', commissionController.getCommissionsByFilter);
// Create new commission
router.post('/', commissionController.createCommission);
// Update commission
router.put('/:id', commissionController.updateCommission);
// Delete commission
router.delete('/:id', commissionController.deleteCommission);
// Get commission breakdown for a company
router.get('/breakdown/:company', commissionController.getCompanyCommissionBreakdown);

module.exports = router; 