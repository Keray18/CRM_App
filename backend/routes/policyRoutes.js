const express = require('express');
const router = express.Router();
const {
  getAllPolicies,
  getPolicyById,
  createPolicy,
  updatePolicy,
  deletePolicy,
  sendRenewalReminder,
  getPolicyStats,
  getLeadsForPolicy,
  updatePolicyStatus
} = require('../controllers/policyController');

// Get all policies with filtering
router.get('/', getAllPolicies);

// Get policy statistics
router.get('/stats', getPolicyStats);

// Get leads for policy conversion
router.get('/leads', getLeadsForPolicy);

// Get a single policy
router.get('/:id', getPolicyById);

// Create a new policy
router.post('/', createPolicy);

// Update a policy
router.put('/:id', updatePolicy);

// Delete a policy
router.delete('/:id', deletePolicy);

// Update policy status
router.patch('/:id/status', updatePolicyStatus);

// Send renewal reminder - make sure this route is registered before any other similar routes
router.post('/:id/send-reminder', sendRenewalReminder);

module.exports = router; 