const express = require('express');
const router = express.Router();
const leadsController = require('../controllers/leadsCont.js');
const upload = require('../middleware/upload.js');

// Get all leads (without document information)
router.get('/', leadsController.getAllLeads);

// Submit a new lead with optional document
router.post('/submit', upload.single('document'), leadsController.submitLeadForm);

// Delete a lead and their document
router.delete('/:id', leadsController.deleteLead);

// Update remarks for a lead
router.patch('/:id/remarks', leadsController.updateRemarks);

module.exports = router;
