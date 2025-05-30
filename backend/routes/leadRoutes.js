const express = require('express');
const router = express.Router();
const leadsController = require('../controllers/leadsCont.js');
const upload = require('../middleware/upload.js');
const checkRole = require('../middleware/checkRole');
const authenticate = require('../middleware/authenticate');

// Get all leads (without document information)
router.get('/', authenticate, checkRole(['standard', 'privileged', 'admin']), leadsController.getAllLeads);

// Submit a new lead with optional document
router.post('/submit', authenticate, checkRole(['standard', 'privileged', 'admin']), upload.single('document'), leadsController.submitLeadForm);

// Delete a lead and their document
router.delete('/:id', authenticate, checkRole(['privileged', 'admin']), leadsController.deleteLead);

// Update remarks for a lead
router.patch('/:id/remarks', authenticate, checkRole(['privileged', 'admin']), leadsController.updateRemarks);

module.exports = router;
