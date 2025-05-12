const { getLeadDocuments, uploadDocument, deleteDocument } = require('../controllers/documentController');
const router = require('express').Router();

// Get all documents for a lead
router.get('/lead/:leadId', getLeadDocuments);

// Upload a new document for a lead
router.post('/lead/:leadId', uploadDocument);

// Delete a document
router.delete('/:id', deleteDocument);

module.exports = router; 