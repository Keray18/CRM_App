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
const checkRole = require('../middleware/checkRole');
const authenticate = require('../middleware/authenticate');

// Get all policies with filtering
router.get('/', authenticate, checkRole(['standard', 'privileged', 'admin']), getAllPolicies);

// Get policy statistics
router.get('/stats', authenticate, checkRole(['standard', 'privileged', 'admin']), getPolicyStats);

// Get leads for policy conversion
router.get('/leads', authenticate, checkRole(['standard', 'privileged', 'admin']), getLeadsForPolicy);

// Get a single policy
router.get('/:id', authenticate, checkRole(['standard', 'privileged', 'admin']), getPolicyById);

// Create a new policy
router.post('/', authenticate, checkRole(['standard', 'privileged', 'admin']), createPolicy);

// Update a policy
router.put('/:id', authenticate, checkRole(['privileged', 'admin']), updatePolicy);

// Delete a policy
router.delete('/:id', authenticate, checkRole(['privileged', 'admin']), deletePolicy);

// Update policy status
router.patch('/:id/status', authenticate, checkRole(['privileged', 'admin']), updatePolicyStatus);

// Send renewal reminder - make sure this route is registered before any other similar routes
router.post('/:id/renewal-reminder', authenticate, checkRole(['standard', 'privileged', 'admin']), sendRenewalReminder);

module.exports = router; 