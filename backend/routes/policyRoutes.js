const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policyController');

// Get all policies with filtering
router.get('/', policyController.getAllPolicies);

// Get policy statistics
router.get('/stats', policyController.getPolicyStats);

// Get leads for policy conversion
router.get('/leads', policyController.getLeadsForPolicy);

// Get a single policy
router.get('/:id', policyController.getPolicyById);

// Create a new policy
router.post('/', policyController.createPolicy);

// Update a policy
router.put('/:id', policyController.updatePolicy);

// Delete a policy
router.delete('/:id', policyController.deletePolicy);

// Update policy status
router.patch('/:id/status', policyController.updatePolicyStatus);

module.exports = router; 